import Link from "next/link";
import dynamicImport from "next/dynamic";
import { z } from "zod";
import type { AppState } from "@excalidraw/excalidraw/types/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AccessLevel } from "@packages/types";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";

export const runtime = "edge";
export const fetchCache = "force-no-store";

const ViewBoard = dynamicImport(() => import("./board-view"), { ssr: false });
const EditBoard = dynamicImport(() => import("./board-edit"), { ssr: false });

const Params = z.object({
  params: z.object({
    drawingId: z.string(),
  }),
});

type Props = z.infer<typeof Params>;

export default async function DrawingBoard(props: Props) {
  const {
    params: { drawingId },
  } = Params.parse(props);

  try {
    const drawing = await api.entities.load.query({ id: drawingId });
    const iceServers = await api.auth.iceServers.query();

    const parsedAppState = drawing.appState
      ? (JSON.parse(drawing.appState) as unknown as AppState)
      : undefined;

    const parsedElements = drawing.elements
      ? (JSON.parse(drawing.elements) as unknown as ExcalidrawElement[]).map(
          (el) => {
            if (
              ["freedraw", "line", "arrow"].includes(el.type) &&
              !("points" in el)
            ) {
              return {
                ...(el as unknown as ExcalidrawElement),
                points: [] as const,
              };
            }
            return el;
          },
        )
      : undefined;

    return (
      <div className="flex w-full items-center justify-center">
        {drawing.accessLevel === AccessLevel.EDIT && (
          <EditBoard
            drawing={drawing}
            elements={parsedElements}
            appState={parsedAppState}
            iceServers={iceServers}
          />
        )}
        {drawing.accessLevel === AccessLevel.READ && (
          <ViewBoard
            drawing={drawing}
            elements={parsedElements}
            appState={parsedAppState}
          />
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <p className="text-lg">Something went wrong</p>
        <Button asChild>
          <Link href={`/dashboard`}>Go to dashboard</Link>
        </Button>
      </div>
    );
  }
}

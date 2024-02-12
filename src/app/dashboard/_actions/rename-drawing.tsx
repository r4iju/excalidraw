"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";

type Props = {
  title: string;
  drawingId: string;
  onTitleChange: VoidFunction;
};

const DrawingTitle = ({ title, drawingId, onTitleChange }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const { mutate } = api.drawings.update.useMutation();

  const handleSave = () => {
    mutate(
      { id: drawingId, title: newTitle },
      {
        onSuccess: () => {
          setIsEditing(false);
          onTitleChange();
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-4">
      {isEditing && (
        <div className="flex flex-1 items-center gap-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" onClick={handleSave}>
            Save
          </Button>
        </div>
      )}
      {!isEditing && (
        <>
          <h2 className="flex-1 text-lg font-bold">{title}</h2>
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            aria-label="Edit title"
          >
            <Pencil1Icon className="h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  );
};

export default DrawingTitle;

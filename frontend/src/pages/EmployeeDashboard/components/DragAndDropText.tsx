import { useCallback, useId } from "react";

import { useDraggable, useDroppable } from "@dnd-kit/react";

export function DragAndDropText({ content }: { content: string }) {
  const dragId = useId();
  const dropId = useId();
  const { ref: dragRef } = useDraggable({ id: dragId });
  const { ref: dropRef } = useDroppable({ id: dropId });

  const refCallback = useCallback(
    (el: HTMLElement) => {
      dragRef(el);
      dropRef(el);
    },
    [dragRef, dropRef],
  );

  return <span ref={refCallback}>{content}</span>;
}

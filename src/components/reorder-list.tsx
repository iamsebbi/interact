"use client";
import React, { useState, useEffect, createContext, useContext } from "react";

import { Grip } from "@/components/icons";
import { Reorder, useDragControls, useMotionValue, type DragControls } from "motion/react";

import { useRaisedShadow } from "@/hooks/useRaisedShadow";
import { cn } from "@/utils/cn";

export const DragHandleContext = createContext<DragControls | null>(null);

export function useReorderDragControls() {
  return useContext(DragHandleContext);
}

export function ReorderDragHandle({
  className,
  onPointerDown,
  ...props
}: React.ComponentProps<typeof Grip>) {
  const controls = useContext(DragHandleContext);

  return (
    <Grip
      data-slot="reorder-drag-handle"
      size={24}
      className={cn(
        "size-6 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-none select-none shrink-0 transition-colors",
        className
      )}
      onPointerDown={(e) => {
        controls?.start(e);
        if (typeof onPointerDown === "function") {
          onPointerDown(e);
        }
      }}
      {...props}
    />
  );
}

export interface ReorderListProps
  extends Partial<React.ComponentProps<typeof Reorder.Group>> {
  /** @public (required) - The children of the list */
  children: React.ReactElement[];
  /** @public (optional) - The className of the list */
  className?: string;
  /** @public (optional) - The className of the item */
  itemClassName?: string;
  /** @public (optional) - With drag handle */
  withDragHandle?: boolean;
  /** @public (optional) - Drag handle position if rendered automatically */
  dragHandlePosition?: "left" | "right";
  /** @public (optional) - When the list is reordered */
  onReorderFinish?: (newOrder: React.ReactElement[]) => void;
}

const ReorderList: React.FC<ReorderListProps> = ({
  children,
  className,
  itemClassName,
  withDragHandle = false,
  dragHandlePosition = "left",
  onReorderFinish,
  ...props
}) => {
  const containerRef = React.useRef<HTMLUListElement>(null);

  const [items, setItems] = useState<React.ReactElement[]>(() =>
    React.Children.toArray(children).filter((child) =>
      React.isValidElement(child)
    ) as React.ReactElement[]
  );

  useEffect(() => {
    const newItems = React.Children.toArray(children).filter((child) =>
      React.isValidElement(child)
    ) as React.ReactElement[];

    setItems((prevItems) => {
      if (prevItems.length !== newItems.length) return newItems;
      const prevKeys = prevItems.map((i) => String(i.key));
      const newKeys = newItems.map((i) => String(i.key));
      const prevSet = new Set(prevKeys);
      const isSameElements = newKeys.every((k) => prevSet.has(k));

      if (isSameElements) return prevItems;
      return newItems;
    });
  }, [children]);

  const handleReorderFinish = (newOrder: unknown[]) => {
    const orderElements = newOrder as React.ReactElement[];
    setItems(orderElements);
    onReorderFinish?.(orderElements);
  };

  return (
    <Reorder.Group
      ref={containerRef}
      data-slot="reorder-list-group"
      axis="y"
      className={cn(
        "flex flex-col gap-2 select-none list-none p-0 m-0 overflow-visible",
        className
      )}
      values={items}
      onReorder={handleReorderFinish}
      {...props}
    >
      {items.map((item, index) => (
        <ReorderListItem
          key={item?.key ?? index}
          item={item}
          withDragHandle={withDragHandle}
          dragHandlePosition={dragHandlePosition}
          className={itemClassName}
          dragConstraints={containerRef}
        />
      ))}
    </Reorder.Group>
  );
};

const ReorderListItem: React.FC<{
  item: React.ReactElement;
  className?: string;
  withDragHandle?: boolean;
  dragHandlePosition?: "left" | "right";
  dragConstraints?: React.RefObject<HTMLUListElement | null>;
}> = ({
  item,
  className,
  withDragHandle = false,
  dragConstraints,
}) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      data-slot="reorder-list-item"
      id={item?.key ? String(item.key) : ""}
      value={item}
      dragConstraints={dragConstraints}
      dragElastic={0.08}
      className={cn(
        "bg-background list-none !p-0 !m-0 rounded-xl",
        !withDragHandle ? "cursor-grab" : "",
        className
      )}
      style={{ boxShadow, y }}
      dragListener={!withDragHandle}
      dragControls={withDragHandle ? dragControls : undefined}
    >
      <DragHandleContext.Provider value={dragControls}>
        {item}
      </DragHandleContext.Provider>
    </Reorder.Item>
  );
};

export { ReorderList };

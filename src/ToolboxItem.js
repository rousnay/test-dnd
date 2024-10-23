import React from "react";
import { useDrag } from "react-dnd";

const ItemType = {
  FIELD: "field",
};

const ToolboxItem = ({ type, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType.FIELD,
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="toolbox-item"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {label}
    </div>
  );
};

export default ToolboxItem;
export { ItemType };

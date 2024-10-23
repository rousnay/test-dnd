import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemType } from "./ToolboxItem";

const DraggableItem = ({
  id,
  index,
  type,
  label,
  options,
  moveItem,
  updateLabel,
  updateOptions,
  addOption,
  modifyOption,
  removeItem,
  duplicateItem,
}) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemType.FIELD,
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.FIELD,
    item: { type, id, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleAddOption = () => {
    addOption(id);
  };

  const handleModifyOption = (optionIndex, newOption) => {
    modifyOption(id, optionIndex, newOption);
  };

  return (
    <div
      ref={ref}
      className="canvas-item"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <input
        type="text"
        value={label}
        onChange={(e) => updateLabel(id, e.target.value)}
        className="canvas-item-label"
      />
      {type === "text" && <input type="text" placeholder={label} />}
      {type === "textarea" && <textarea placeholder={label} />}
      {(type === "radio" || type === "checkbox") && (
        <div>
          {options.map((option, idx) => (
            <div key={idx}>
              <input
                type={type}
                name={type === "radio" ? id : undefined}
                defaultChecked={false}
              />
              <input
                type="text"
                value={option}
                onChange={(e) => handleModifyOption(idx, e.target.value)}
                className="option-input"
              />
            </div>
          ))}
          <button onClick={handleAddOption}>Add Option</button>
        </div>
      )}
      {type === "dropdown" && (
        <div>
          <select>
            {options.map((option, idx) => (
              <option key={idx}>{option}</option>
            ))}
          </select>
          {options.map((option, idx) => (
            <div key={idx}>
              <input
                type="text"
                value={option}
                onChange={(e) => handleModifyOption(idx, e.target.value)}
                className="option-input"
              />
            </div>
          ))}
          <button onClick={handleAddOption}>Add Option</button>
        </div>
      )}
      <div className="canvas-item-actions">
        <button onClick={() => duplicateItem(id)}>Duplicate</button>
        <button onClick={() => removeItem(id)}>Remove</button>
      </div>
    </div>
  );
};

export default DraggableItem;

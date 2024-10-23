import React, { useState } from "react";
import { useDrop } from "react-dnd";
import update from "immutability-helper";
import ToolboxItem, { ItemType } from "./ToolboxItem";
import DraggableItem from "./DraggableItem";

const Canvas = () => {
  const [items, setItems] = useState([]);

  const [, drop] = useDrop(() => ({
    accept: ItemType.FIELD,
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        addItem(item.type);
      }
    },
  }));

  const addItem = (type) => {
    let label = "";
    let options = undefined;
    switch (type) {
      case "text":
        label = "Text Input";
        break;
      case "textarea":
        label = "Text Area";
        break;
      case "radio":
        label = "Radio Button";
        options = ["Option 1"];
        break;
      case "checkbox":
        label = "Checkbox";
        options = ["Option 1"];
        break;
      case "dropdown":
        label = "Dropdown";
        options = ["Option 1"];
        break;
      default:
        label = "Input Field";
    }
    setItems((prevItems) => [
      ...prevItems,
      { id: Date.now(), type, label, options },
    ]);
  };

  const moveItem = (dragIndex, hoverIndex) => {
    const draggedItem = items[dragIndex];
    const updatedItems = update(items, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, draggedItem],
      ],
    });

    // Update the index values for each item after moving
    setItems(
      updatedItems.map((item, index) => ({
        ...item,
        index,
      }))
    );
  };

  const updateLabel = (id, newLabel) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, label: newLabel } : item
      )
    );
  };

  const updateOptions = (id, newOptions) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, options: newOptions } : item
      )
    );
  };

  const addOption = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              options: [
                ...(item.options || []),
                `Option ${item.options?.length + 1 || 1}`,
              ],
            }
          : item
      )
    );
  };

  const modifyOption = (id, optionIndex, newOption) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              options: item.options.map((opt, idx) =>
                idx === optionIndex ? newOption : opt
              ),
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const duplicateItem = (id) => {
    setItems((prevItems) => {
      const itemToDuplicate = prevItems.find((item) => item.id === id);
      if (itemToDuplicate) {
        return [...prevItems, { ...itemToDuplicate, id: Date.now() }];
      }
      return prevItems;
    });
  };

  const saveForm = () => {
    const savedForm = JSON.stringify(items);
    localStorage.setItem("savedForm", savedForm);
  };

  const loadForm = () => {
    const savedForm = localStorage.getItem("savedForm");
    if (savedForm) {
      const parsedItems = JSON.parse(savedForm);
      setItems(
        parsedItems.map((item, index) => ({
          ...item,
          index,
        }))
      );
    }
  };

  return (
    <div>
      <div className="toolbox">
        <ToolboxItem type="text" label="Text Input" />
        <ToolboxItem type="textarea" label="Text Area" />
        <ToolboxItem type="radio" label="Radio Button" />
        <ToolboxItem type="checkbox" label="Checkbox" />
        <ToolboxItem type="dropdown" label="Dropdown" />
      </div>
      <div className="canvas-actions">
        <button onClick={saveForm}>Save Form</button>
        <button onClick={loadForm}>Load Form</button>
      </div>
      <div ref={drop} className="canvas">
        {items.map((item, index) => (
          <DraggableItem
            key={item.id}
            index={index}
            id={item.id}
            type={item.type}
            label={item.label}
            options={item.options || []}
            moveItem={moveItem}
            updateLabel={updateLabel}
            updateOptions={updateOptions}
            addOption={addOption}
            modifyOption={modifyOption}
            removeItem={removeItem}
            duplicateItem={duplicateItem}
          />
        ))}
      </div>
    </div>
  );
};

export default Canvas;

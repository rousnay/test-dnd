import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ToolboxItem from "./ToolboxItem";
import Canvas from "./Canvas";
import "./App.css";

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        {/* <div className="toolbox">
          <ToolboxItem type="text" label="Text Input" />
          <ToolboxItem type="textarea" label="Text Area" />
          <ToolboxItem type="radio" label="Radio Button" />
          <ToolboxItem type="checkbox" label="Checkbox" />
          <ToolboxItem type="dropdown" label="Dropdown" />
        </div> */}
        <Canvas />
      </div>
    </DndProvider>
  );
};

export default App;

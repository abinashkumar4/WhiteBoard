import React, { useEffect, useRef, useContext } from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context.js";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../../constants.js";
import toolboxContext from "../../store/toolbox-context.js";
import classes from "./index.module.css";

function Board() {
  const {
    elements,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    toolActionType,
    textAreaBlurHandler,
  } = useContext(boardContext);
  const { toolboxState } = useContext(toolboxContext);
  const canvasRef = useRef();
  const textAreaRef = useRef(); 
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext("2d");
    context.save();
    const RoughCanvas = rough.canvas(canvas);
    //let generator = RoughCanvas.generator;
    // let rect2 = generator.rectangle(10,10,100,100,{
    //   fill:"red",
    //   stroke:"blue"
    // })
    // let rect1 = generator.rectangle(10,120,100,100,{
    //   fill:"red",
    //   stroke:"blue"
    // })
    // RoughCanvas.draw(rect1);
    // RoughCanvas.draw(rect2);
    // elements.forEach((element) => {
    //   RoughCanvas.draw(element.roughEle);
    // })

    elements.forEach((element) => {
      console.log(element);
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          RoughCanvas.draw(element.roughEle);
          break;
        case TOOL_ITEMS.BRUSH:
          context.fillStyle = element.stroke;
          context.fill(element.path);
          context.restore();
          break;
        case TOOL_ITEMS.TEXT:
          context.textBaseline = "top";
          context.font = `${element.size}px Caveat`;
          context.fillStyle = element.stroke;
          context.fillText(element.text, element.x1, element.y1);
          context.restore();
          break;
        default:
          throw new Error("Type not recognized");
      }
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements]);
  const handleMouseDown = (event) => {
    boardMouseDownHandler(event, toolboxState);
  };
  const handleMouseMove = (event) => {
    boardMouseMoveHandler(event);
  };

  const handleMouseUp = () => {
    boardMouseUpHandler();
  };

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  }, [toolActionType]);

  return (
    <div>
      {toolActionType === TOOL_ACTION_TYPES.WRITING && (
        <textarea
          type="text"
          ref={textAreaRef}
          className={classes.textElementBox}
          style={{
            top: elements[elements.length - 1].y1,
            left: elements[elements.length - 1].x1,
            fontSize: `${elements[elements.length - 1]?.size}px`,
            color: elements[elements.length - 1]?.stroke,
          }}
          onBlur={(event) => textAreaBlurHandler(event.target.value)}
        />
      )}
      <canvas
        ref={canvasRef}
        id="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}

export default Board;

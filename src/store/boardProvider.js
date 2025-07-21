import React, { useState, useReducer } from "react";
import boardContext from "./board-context";
import { TOOL_ITEMS, TOOL_ACTION_TYPES,BOARD_ACTIONS } from "../../constants";
import rough from "roughjs";
const gen = rough.generator();
import { createElements,
  getSvgPathFromStroke,
  isPointNearElement,
 } from "../utils/elements";
import getStroke from "perfect-freehand";


const boardReducer = (state, action) => {
  switch (action.type) {
    case BOARD_ACTIONS.CHANGE_TOOL: {
      return {
        ...state,
        activeToolItem: action.payload.tool,
      };
    }
    case BOARD_ACTIONS.CHANGE_ACTION_TYPE:
      return {
        ...state,
        toolActionType: action.payload.actionType,
      };
    case BOARD_ACTIONS.DRAW_DOWN: {
      
      let x1 = action.payload.clientX;
      let y1 = action.payload.clientY;
      
      let x2 = x1;
      let y2 = y1;
      let stroke = action.payload?.stroke;
      let fill = action.payload?.fill;
      let size = action.payload?.size;

      let newElement = createElements(state.elements.length, x1, y1, x2, y2, {
        type: state.activeToolItem,
        stroke,
        fill,
        size,
      });
      const prevElem = state.elements;
      return {
        ...state,
        toolActionType: state.activeToolItem === TOOL_ITEMS.TEXT
        ? TOOL_ACTION_TYPES.WRITING
        : TOOL_ACTION_TYPES.DRAWING,
        elements: [...prevElem, newElement],
      };
    }
    case BOARD_ACTIONS.DRAW_MOVE: {
     
      const { clientX, clientY } = action.payload;
      const newElement = [...state.elements];
      let lastelementIdx = newElement.length - 1;
      let stroke = newElement[lastelementIdx]?.stroke;
      let fill = newElement[lastelementIdx]?.fill;
      let size = newElement[lastelementIdx]?.size;
      let type = newElement[lastelementIdx]?.type;

      switch (type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          const { x1, y1, stroke, fill, size } = newElement[lastelementIdx];
          const newElements = createElements(lastelementIdx, x1, y1, clientX, clientY, {
            type: state.activeToolItem,
            stroke,
            fill,
            size,
          });
          newElement[lastelementIdx] = newElements;
          return {
            ...state,
            elements: newElement,
          };
        case TOOL_ITEMS.BRUSH:
          newElement[lastelementIdx].points = [
            ...newElement[lastelementIdx].points,
            { x: clientX, y: clientY },
          ];
          newElement[lastelementIdx].path = new Path2D(
            getSvgPathFromStroke(getStroke(newElement[lastelementIdx].points))
          );
          return {
            ...state,
            elements: newElement,
          };
         
      }

      // newElement[lastelementIdx] = createElements(state.elements.length,newElement[lastelementIdx].x1,newElement[lastelementIdx].y1,clientX,clientY,{type:state.activeToolItem,stroke,fill,size})
      // return {
      //   ...state,
      //   elements:newElement,
      // }
    }

    case BOARD_ACTIONS.DRAW_UP: {
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.NONE,
      };
    }
    
    case BOARD_ACTIONS.ERASE: {
      const { clientX, clientY } = action.payload;
      let newElements = [...state.elements];
      newElements = newElements.filter((element) => {
        return !isPointNearElement(element, clientX, clientY);
      });
      
     
      return {
        ...state,
        elements: newElements,
      };
    }
    
    case BOARD_ACTIONS.CHANGE_TEXT: {
      const index = state.elements.length - 1;
      
      const newElements = [...state.elements];
      newElements[index].text = action.payload.text;
      
      console.log("change text called");
      return {
        ...state,
        toolActionType: TOOL_ACTION_TYPES.NONE,
        elements: newElements,
        index: state.index + 1,
      };
    }

    default:
      return state;
  }
};

const initialBoardState = {
  activeToolItem: TOOL_ITEMS.LINE,
  toolActionType: TOOL_ACTION_TYPES.NONE,
  elements: [],
};
const BoardProvider = ({ children }) => {
  const [boardState, dispatchBoardAction] = useReducer(
    boardReducer,
    initialBoardState
  );

  //const[ activeToolItem,setActiveToolItem] = useState(TOOL_ITEMS.LINE);
  const changeToolHandle = (tool) => {
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_TOOL,
      payload: {
        tool,
      },
    });
  };

  const boardMouseDownHandler = (event, toolboxState) => {
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    const { clientX, clientY } = event;
    console.log(clientX, clientY);
    if (boardState.activeToolItem === TOOL_ITEMS.ERASER) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        payload: {
          actionType: TOOL_ACTION_TYPES.ERASING,
        },
      });
      return;
    }
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_DOWN,
      payload: {
        clientX,
        clientY,
        stroke: toolboxState[boardState.activeToolItem]?.stroke,
        fill: toolboxState[boardState.activeToolItem]?.fill,
        size: toolboxState[boardState.activeToolItem]?.size,
      },
    });
  };

  const boardMouseMoveHandler = (event) => {
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    const { clientX, clientY } = event;
    console.log(clientX, clientY);
    if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {
      dispatchBoardAction({
        type: BOARD_ACTIONS.ERASE,
        payload: {
          clientX,
          clientY,
        },
      });
    }
    else if(boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING){

    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_MOVE,
      payload: {
        clientX,
        clientY,
      },
    });
  }
  };

  const boardMouseUpHandler = (event) => {
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    dispatchBoardAction({
      type: BOARD_ACTIONS.DRAW_UP,
    });
  };

  const textAreaBlurHandler = (text) => {
    console.log("blur called");
    console.log(text);
    dispatchBoardAction({
      type: BOARD_ACTIONS.CHANGE_TEXT,
      payload: {
        text,
      },
    });
  };

  const boardContextValue = {
    activeToolItem: boardState.activeToolItem,    
    elements: boardState.elements,
    toolActionType: boardState.toolActionType,
    boardMouseDownHandler,
    changeToolHandle,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
  };
  return (
    <boardContext.Provider value={boardContextValue}>
      {children}
    </boardContext.Provider>
  );
};

export default BoardProvider;

import React, { useContext, useState } from "react";
import classes from "./index.module.css";
import cname from "classname";
import {
  FaSlash,
  FaRegCircle,
  FaArrowRight,
  FaPaintBrush,
  FaEraser,
  FaUndoAlt,
  FaRedoAlt,
  FaFont,
  FaDownload,
} from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import boardContext from "../../store/board-context";
import { TOOL_ITEMS } from "../../../constants";

export const Toolbar = () => {
  const { activeToolItem, changeToolHandle } = useContext(boardContext);
  return (
    <div className={classes.container}>
      <div
        className={cname(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.BRUSH,
        })}
        onClick={() => changeToolHandle(TOOL_ITEMS.BRUSH)}
      >
        <FaPaintBrush />
      </div>

      <div
        className={cname(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.LINE,
        })}
        onClick={() => changeToolHandle(TOOL_ITEMS.LINE)}
      >
        <FaSlash />
      </div>
      <div
        className={cname(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.RECTANGLE,
        })}
        onClick={() => changeToolHandle(TOOL_ITEMS.RECTANGLE)}
      >
        <LuRectangleHorizontal />
      </div>
      <div
        className={cname(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.CIRCLE,
        })}
        onClick={() => changeToolHandle(TOOL_ITEMS.CIRCLE)}
      >
        <FaRegCircle />
      </div>
      <div
        className={cname(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.ARROW,
        })}
        onClick={() => changeToolHandle(TOOL_ITEMS.ARROW)}
      >
        <FaArrowRight />
      </div>
      <div
        className={cname(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.ERASER,
        })}
        onClick={() => changeToolHandle(TOOL_ITEMS.ERASER)}
      >
        <FaEraser />
      </div>
      <div
        className={cname(classes.toolItem, {
          [classes.active]: activeToolItem === TOOL_ITEMS.TEXT,
        })}
        onClick={() => changeToolHandle(TOOL_ITEMS.TEXT)}
      >
        <FaFont />
      </div>
    </div>
  );
};

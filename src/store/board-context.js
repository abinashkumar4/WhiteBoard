import React from 'react';
import { createContext } from 'react';

const boardContext = createContext(
    {
        activeToolItem: "",
        toolActionType: "",
        elements: [],
        boardMouseDownHandler: () => {},
        boardMouseUpHandler: () => {},
        changeToolHandle: () => {},
        boardMouseMoveHandler: () => {},

    }
)

export default boardContext
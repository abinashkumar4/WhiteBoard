import React from 'react';
import { createContext } from 'react';

const boardContext = createContext(
    {
        activeToolItem: "",
        toolActionType: "",
        elements: [],
        history: [[]],
        index: 0,
        boardMouseDownHandler: () => {},
        boardMouseUpHandler: () => {},
        changeToolHandle: () => {},
        boardMouseMoveHandler: () => {},

    }
)

export default boardContext
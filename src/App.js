import Board from "./Components/Board/Board";
import { Toolbar } from "./Components/Toolbar/ToolBar";
import Toolbox from "./Components/Toolbox/Toolbox";
import BoardProvider from "./store/boardProvider";
import ToolboxProvider from "./store/toolboxProvider";

function App() {
    return (
        <div>
    <BoardProvider>
    <ToolboxProvider>     
    <Board />
    <Toolbar />
    <Toolbox/>
    </ToolboxProvider>   
    </BoardProvider>
    </div>
    )
}

export default App;

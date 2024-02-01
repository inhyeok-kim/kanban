import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import KanbanBoard from "./kanban/KanbanBoard";
import DndContext from "./lib/dnd/DndContext";
import Dnd from "./lib/dnd/DndContext";
import Board from "./lib/dndkit/Board";

function App() {
  return (
    <Grid2
      sx={{
        userSelect : 'none'
      }}
      width={900}
    >
      <KanbanBoard />
    </Grid2>
  );
}

export default App;

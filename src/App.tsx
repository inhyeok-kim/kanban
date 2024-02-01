import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import KanbanBoard from "./kanban/KanbanBoard";
import { Button, Stack } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { url } from "inspector";

function App() {
  return (
    <Grid2
      sx={{
        userSelect : 'none'
      }}
      width={'100%'}
      height={'100vh'}
    >
      <Grid2>
        <Stack 
          direction={"row"}
          bgcolor={blueGrey[300]}
          height={'2rem'}
        >
          <Button sx={{color : "white"}}>Menu1</Button>
          <Button sx={{color : "white"}}>Menu2</Button>
          <Button sx={{color : "white"}}>Menu3</Button>
        </Stack>
      </Grid2>
      <Grid2
        height={'calc(100% - 2rem)'}
        padding={2}
        sx={{
          backgroundImage : "url(/bgimg2.jpg)",
          backgroundSize: 'cover',
        }}
      >
        <KanbanBoard />
      </Grid2>
    </Grid2>
  );
}

export default App;

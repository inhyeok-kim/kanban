import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Button, Stack } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Router from "./Router";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(()=>{
    if(location.pathname === '/') navigate('board');
  },[]);

  return (
    <Grid2
      width={'100%'}
      height={'100vh'}
    >
      <Grid2>
        <Stack 
          direction={"row"}
          bgcolor={blueGrey[300]}
          height={'2rem'}
        >
          <Button sx={{color : "white"}} onClick={()=>{navigate('/board')}}>Board</Button>
          <Button sx={{color : "white"}} onClick={()=>{navigate('/note')}}>Note</Button>
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
        <Router />
      </Grid2>
    </Grid2>
  );
}

export default App;

import { Route, Routes } from "react-router-dom";
import BoardPage from "./page/BoardPage";
import NotePage from "./page/NotePage";

export default function Router(){
    return (
        <Routes>
        <Route path="board" element={<BoardPage/>} />
        <Route path="note" element={<NotePage/>} />
      </Routes>
    )
}
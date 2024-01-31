import { Card, CardContent, Stack } from "@mui/material";
import { DragEvent, MouseEvent, ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from "react"

export const DndContext = createContext<any>({});

export default function Dnd(){
    return (
        <DndContextProvider>
            <Stack
                width={250}
            >
                <DndDroppable>
                    <DndDraggable>
                        <Card
                        >
                            <CardContent>
                                hi
                            </CardContent>
                        </Card>
                    </DndDraggable>
                </DndDroppable>
            </Stack>
        </DndContextProvider>
    )
}



interface DndContextProviderProps {
    children : ReactNode | ReactNode[]
}
function DndContextProvider(props : DndContextProviderProps){
    
    const [data,setData] = useState(1);

    const provided = useMemo(()=>({
        dragStartHandler,
        dragEndHandler,
        targetDraggable : null,
        targetDroppable : null,
    }),[]);

    const draggableTargetDom = useRef<HTMLDivElement>();
    const mousePosition = useRef<any>({});
    const isDragging = useRef<boolean>(false);

    function dragStartHandler(dom : HTMLDivElement,e:MouseEvent){
        draggableTargetDom.current = dom;

        const prevCss = {
            width : dom.offsetWidth + 'px',
            height : dom.offsetHeight + 'px'
        }

        dom.style.position = 'fixed';
        dom.style.width = prevCss.width;
        dom.style.height = prevCss.height;
        mousePosition.current.gapX = e.nativeEvent.offsetX;
        mousePosition.current.gapY = e.nativeEvent.offsetY;
        isDragging.current = true;

        document.body.style.cursor = 'pointer';
        //@ts-ignore
        document.addEventListener('mousemove',dragHandler)
    }

    function dragHandler(e:MouseEvent){
        if(draggableTargetDom.current && mousePosition.current && isDragging.current){
            const dom = draggableTargetDom.current;
            const mouse = mousePosition.current;
            dom.style.top = e.clientY - mouse.gapY + 'px';
            dom.style.left = e.clientX - mouse.gapX + 'px';
        }
    }
    
    function dragEndHandler(e:MouseEvent){
        isDragging.current = false;
        //@ts-ignore
        document.removeEventListener('mousemove',dragHandler)
        if(draggableTargetDom.current){
            const dom = draggableTargetDom.current;

            document.body.style.cursor = '';

            dom.style.position = '';
            dom.style.width = '';
            dom.style.height = '';
            dom.style.top = '';
            dom.style.left = '';
        }
    }

    return (
        <DndContext.Provider value={provided}>
            {props.children}
        </DndContext.Provider>
    )
}



interface DndDroppableProps {
    children : ReactNode | ReactNode[]
}
function DndDroppable(props : DndDroppableProps){
    const dom = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={dom}
            // onMouseMove={(e)=>{console.log(e)}}
        >
            {props.children}
        </div>
    )
}



interface DndDraggableProps {
    children : ReactNode | ReactNode[]
}
function DndDraggable(props : DndDraggableProps){
    const domRef = useRef<HTMLDivElement>(null);
    const dndContext = useContext(DndContext);

    function dragStartHandler(e:MouseEvent){
        if(domRef.current){
            const dom = domRef.current;
            dndContext.dragStartHandler(dom,e);
        }
        return false;
    }

    function dragEndHandler(e:MouseEvent){
        dndContext.dragEndHandler(e);
    }

    return (
        <div
            ref={domRef}
            onMouseDown={dragStartHandler}
            onMouseUp={dragEndHandler}
        >
            {props.children}
        </div>
    )
}
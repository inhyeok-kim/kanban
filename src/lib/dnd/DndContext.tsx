import { Card, CardContent, Stack } from "@mui/material";
import { MouseEvent, ReactElement, ReactNode, cloneElement, createContext, useContext, useEffect, useMemo, useRef, useState } from "react"

export const DndContext = createContext<any>({});

export default function Dnd(){
    return (
        <DndContextProvider>
            <Stack
                direction={"row"}
            >
                <DndDroppable
                    droppableId={0}
                    render={
                        (droppableId : string | number)=>{
                            return (
                            <Stack
                                width={250}
                                minHeight={50}
                                padding={1}
                                border={'1px solid black'}
                            >
                                <DndDraggable
                                    parentDroppableId={droppableId}
                                >
                                        <Card
                                        >
                                            <CardContent>
                                                1
                                            </CardContent>
                                        </Card>
                                </DndDraggable>
                            </Stack>
                            )
                        }
                    }
                />
                <DndDroppable
                    droppableId={1}
                    render={
                        (droppableId : string | number)=>{
                            return (
                            <Stack
                                width={250}
                                minHeight={50}
                                padding={1}
                                border={'1px solid black'}
                            >
                                <DndDraggable
                                    parentDroppableId={droppableId}
                                >
                                        <Card
                                        >
                                            <CardContent>
                                                2
                                            </CardContent>
                                        </Card>
                                </DndDraggable>
                            </Stack>
                            )
                        }
                    }
                />
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
        addDroppable,
        addDraggable,
        targetDraggable : null,
        targetDroppable : null,
    }),[]);

    const draggableTargetDom = useRef<HTMLDivElement>();
    const mousePosition = useRef<any>({});
    const isDragging = useRef<boolean>(false);

    const droppableList = useRef<any[]>([]);
    const targetDroppable = useRef<any>();
    const draggableList = useRef<{[index : string] : any[]}>({});

    function addDroppable(id : string | number, dom : HTMLElement){
        droppableList.current!.push({dom, id});
    }
    function addDraggable(droppableId : string | number, dom : HTMLElement){
        if(draggableList.current![droppableId]){
            draggableList.current![droppableId].push(dom);
        } else {
            draggableList.current![droppableId] = [dom];
        }
    }

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
            const cy = (dom.offsetTop + dom.offsetHeight/2);
            const cx = (dom.offsetLeft + dom.offsetWidth/2);
            if(droppableList.current){
                let flag = false;
                droppableList.current.forEach(droppable=>{
                    const dropDom = droppable.dom;
                    // console.log(dropDom.offsetTop ,dropDom.offsetLeft, dropDom.offsetHeight, dropDom.offsetWidth);
                    if(
                        dropDom.offsetTop <= cy && cy <= (dropDom.offsetTop + dropDom.offsetHeight)
                        &&
                        dropDom.offsetLeft <= cx && cx <= (dropDom.offsetLeft + dropDom.offsetWidth)
                    ){
                        flag = true;
                        targetDroppable.current = droppable.id;
                    }
                });
                if(!flag){
                    targetDroppable.current = undefined;
                } else {
                    const draggables = draggableList.current[targetDroppable.current];
                    draggables.forEach((draggable)=>{
                        if(draggable != dom){
                            
                        }
                    });
                }
            }
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

            if(targetDroppable.current){
                const dropDom = targetDroppable.current;
                dropDom.append(dom);
            } else {

            }
        }
    }

    return (
        <DndContext.Provider value={provided}>
            {props.children}
        </DndContext.Provider>
    )
}



interface DndDroppableProps {
    droppableId : string | number
    render : Function
}
function DndDroppable(props : DndDroppableProps){
    const dom = useRef<HTMLDivElement>(null);
    const dndContext = useContext(DndContext);

    useEffect(()=>{
        if(dom.current){
            dndContext.addDroppable(props.droppableId,dom.current);
        }
    },[dom]);

    return (
        <div
            ref={dom}
        >
            {
                props.render(props.droppableId)
            }
        </div>
    )
}



interface DndDraggableProps {
    children : ReactNode | ReactNode[]
    parentDroppableId : string | number
}
function DndDraggable(props : DndDraggableProps){
    const domRef = useRef<HTMLDivElement>(null);
    const dndContext = useContext(DndContext);

    useEffect(()=>{
        dndContext.addDraggable(props.parentDroppableId,domRef.current);
    },[domRef]);

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
import { TextField, Typography } from "@mui/material";
import { ChangeEvent, useDeferredValue, useEffect, useLayoutEffect, useRef, useState } from "react";

export interface CardTitleProps {
    text : string
    onChange : Function
}
export default function CardTitle(props : CardTitleProps){
    const [value, setValue] = useState<string>(props.text);
    const deferredValue = useDeferredValue(value);
    const [isEdit, setIsEdit] = useState(false);
    const inputRef = useRef<HTMLInputElement>();

    useEffect(()=>{
        props.onChange(deferredValue);
    },[deferredValue]);

    function changeHandler(e:ChangeEvent<HTMLInputElement>){
        setValue(e.currentTarget.value);
    }

    useLayoutEffect(()=>{
        if(isEdit){
            inputRef.current!.focus();
        }
    },[isEdit]);

    return (
        <>
            {
                isEdit?
                    <TextField 
                        inputRef={inputRef}
                        fullWidth
                        variant="outlined" 
                        size="small"
                        InputProps={{
                            // disableUnderline: true,
                            margin:"none",
                        }}
                        value={value}
                        onChange={changeHandler}
                        onClick={(e)=>{e.stopPropagation()}}
                        inputProps={{
                            style : {
                                fontSize : '11px',
                                width : 170,
                                padding : 5
                            }
                        }}
                        onBlur={()=>{setIsEdit(false)}}
                    />
                :
                <div
                    onClick={(e)=>{
                        setIsEdit(true)
                        e.stopPropagation();
                    }}
                >
                    <Typography
                        fontSize={11}
                        width={170}
                        variant="body1"
                        noWrap={true}
                        sx={{
                            ':hover' : {
                                cursor : 'text'
                            }
                        }}
                    >
                        {value}
                    </Typography>
                </div>

            }
        </>
    )
}
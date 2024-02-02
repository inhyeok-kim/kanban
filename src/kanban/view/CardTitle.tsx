import { TextField } from "@mui/material";
import { ChangeEvent, useDeferredValue, useEffect, useState } from "react";

export interface CardTitleProps {
    text : string
    onChange : Function
}
export default function CardTitle(props : CardTitleProps){
    const [value, setValue] = useState<string>(props.text);
    const deferredValue = useDeferredValue(value);

    useEffect(()=>{
        props.onChange(deferredValue);
    },[deferredValue]);

    function changeHandler(e:ChangeEvent<HTMLInputElement>){
        setValue(e.currentTarget.value);
    }
    return (
        <TextField 
            variant="standard" 
            size="small"
            InputProps={{
                disableUnderline: true,
                margin:"none",
            }}
            value={value}
            onChange={changeHandler}
            inputProps={{
                style : {
                    fontSize : '11px',
                }
            }}
        />
    )
}
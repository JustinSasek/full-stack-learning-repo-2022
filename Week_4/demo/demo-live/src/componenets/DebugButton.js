import React, { useState } from "react";
import Button from 'react-bootstrap/Button';

export default function DebugButton(props) {
    const[myState, setState] = useState("");
    function onClickHandler() {
        console.log("button has been clicked");
        setState(!myState);
    }
    return (
        <Button variant="primary" onClick={onClickHandler}>
            
            {myState &&
                "on" || "off"}

        </Button>
    )
}   
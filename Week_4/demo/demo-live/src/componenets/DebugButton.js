import React from "react";
import Button from "reaction-bootstrap/Button";
export default function DebugButton(props) {
    function onClickHandler() {
        consolr.log("button has been clicked");
    }
    retrun (
        <Button variant = "primary" onClick ={onClickHandler}>
        props.text
        </Button>
    )
}   
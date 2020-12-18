import React, {useState, useRef, useEffect} from 'react';
import io from "socket.io-client";

const socket = io("http://localhost:4000");

interface Props{}

export const LiarsDice: React.FC<Props>=()=>{

    return(
        <div>
            <a>
                Hello
            </a>
        </div>
    )
}

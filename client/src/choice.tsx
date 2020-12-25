import React, {useState, useRef, useEffect, FunctionComponent} from 'react';

export const Choices: React.FC = () =>{
    return(
        <div>
            <select name="option" placeholder="Select">
                <option value="one">One</option>
                <option value="two">Two</option>
                <option value="three">Three</option>
                <option value="four">Four</option>
                <option value="five">Five</option>
                <option value="six">Six</option>
            </select>
        </div>
    )
}
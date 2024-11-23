import { useUserSession } from '../utils/supabase';
import '../styles/SearchTags.css';
import { useState } from 'react';

function MagnifySvg() {
    return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke="#D5DDDF" d="M20.75 20.75L16.0375 16.0375M18.5833 9.91667C18.5833 14.7031 14.7031 18.5833 9.91667 18.5833C5.1302 18.5833 1.25 14.7031 1.25 9.91667C1.25 5.1302 5.1302 1.25 9.91667 1.25C14.7031 1.25 18.5833 5.1302 18.5833 9.91667Z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

interface Buttons {
    [key: string]: boolean;
  }

interface SearchTagsProps {
    buttons: Buttons,
    setSelectedButtons: Function,
    mousePosition: number[],
};

function SearchTags({buttons, setSelectedButtons, mousePosition} : SearchTagsProps) {
    const [searchParams, setSearchParams] = useState("");
    const listItems = Object.entries(buttons).map(([key, value]) => 
    {
        if (searchParams === "") {
            if (value) {
                return (
                    <input key={key} type="button" value={key} className='searchTagsButtonChecked' onClick={()=>{setSelectedButtons(key)}}/>
                );     
            }
            return (
                <input key={key} type="button" value={key} className='searchTagsButton' onClick={()=>{setSelectedButtons(key)}}/>
             );
        } else {
            if (key.toLowerCase().search(searchParams.toLowerCase()) >= 0) {
                if (value) {
                    return (
                        <input key={key} type="button" value={key} className='searchTagsButtonChecked' onClick={()=>{setSelectedButtons(key)}}/>
                    );     
                }
                return (
                    <input key={key} type="button" value={key} className='searchTagsButton' onClick={()=>{setSelectedButtons(key)}}/>
                 ); 
            }
        }
    }
    )

    const xPosition: number = mousePosition[0];
    const yPosition: number = mousePosition[1];
    let mouseStyles = {
        left: xPosition,
        top: yPosition
    };

    if (xPosition > window.innerWidth / 1.2) {
        mouseStyles.left = xPosition-360;
    }

    if (yPosition > window.innerHeight / 1.9) {
        console.log("true")
        mouseStyles.top = yPosition-275;
    } else {
        mouseStyles.top = yPosition+350;
    }



    return (
        <div className='searchTags' style={mouseStyles}>
            <div className='searchTagsSearchBar'>
                <input type='text' placeholder='Search' onChange={(e)=>{setSearchParams(e.currentTarget.value)}} className='searchTagsInput' style={{outline: 'None', borderStyle: "None"}}/>
                <div className='magnifySvg'>
                    <MagnifySvg/>
                </div>
            </div>
            <div className='searchedTagsContainer'>
                {listItems}
            </div>
        </div>
    );
}

export default SearchTags;
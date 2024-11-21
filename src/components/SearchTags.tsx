import { useUserSession } from '../utils/supabase';
import '../styles/SearchTags.css';
import { useState } from 'react';

function MagnifySvg() {
    return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke="#D5DDDF" d="M20.75 20.75L16.0375 16.0375M18.5833 9.91667C18.5833 14.7031 14.7031 18.5833 9.91667 18.5833C5.1302 18.5833 1.25 14.7031 1.25 9.91667C1.25 5.1302 5.1302 1.25 9.91667 1.25C14.7031 1.25 18.5833 5.1302 18.5833 9.91667Z" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
}

interface Buttons {
    [key: string]: boolean;
  }

interface SearchTagsProps {
    buttons: Buttons,
    setSelectedButtons: Function,
    mousePosition: any[],
};

function SearchTags({buttons, setSelectedButtons, mousePosition} : SearchTagsProps) {
    const [searchParams, setSearchParams] = useState("");
    const listItems = Object.entries(buttons).map(([key, value]) => 
    {
        if (searchParams === "") {
            if (value) {
                return (
                    <input type="button" value={key} className='searchTagsButtonChecked' onClick={()=>{setSelectedButtons(key)}}/>
                );     
            }
            return (
                <input type="button" value={key} className='searchTagsButton' onClick={()=>{setSelectedButtons(key)}}/>
             );
        } else {
            if (key.toLowerCase().search(searchParams.toLowerCase()) >= 0) {
                if (value) {
                    return (
                        <input type="button" value={key} className='searchTagsButtonChecked' onClick={()=>{setSelectedButtons(key)}}/>
                    );     
                }
                return (
                    <input type="button" value={key} className='searchTagsButton' onClick={()=>{setSelectedButtons(key)}}/>
                 ); 
            }
        }
    }
    )

    const xPosition: number = mousePosition[0];
    const yPosition: number = mousePosition[1];
    let mouseStyles: any;

    if (!mousePosition[2] && !mousePosition[3]) {
        mouseStyles = {
            left: xPosition,
            top: yPosition
        }
    } else if (!mousePosition[2] && mousePosition[3]) {
        mouseStyles = {
            left: xPosition,
            top: yPosition-180
        }
    } else if (mousePosition[2] && !mousePosition[3]) {
        mouseStyles = {
            left: xPosition-250,
            top: yPosition
        }
    } else {
        mouseStyles = {
            left: xPosition,
            top: yPosition
        }
    }


    return (
        <div className='searchTags' style={mouseStyles}>
            <div className='searchTagsSearchBar'>
                <input type='text' placeholder='Search for a trait' onChange={(e)=>{setSearchParams(e.currentTarget.value)}}/>
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
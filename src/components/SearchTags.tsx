import { useUserSession } from '../utils/supabase';
import '../styles/SearchTags.css';


function MagnifySvg() {
    return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke="#D5DDDF" d="M20.75 20.75L16.0375 16.0375M18.5833 9.91667C18.5833 14.7031 14.7031 18.5833 9.91667 18.5833C5.1302 18.5833 1.25 14.7031 1.25 9.91667C1.25 5.1302 5.1302 1.25 9.91667 1.25C14.7031 1.25 18.5833 5.1302 18.5833 9.91667Z" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
}

interface SearchTagsProps {
    buttons: string[],
    selectedButtons: boolean[],
    setSelectedButtons: Function,
};

function SearchTags({buttons, selectedButtons, setSelectedButtons} : SearchTagsProps) {
    const listItems = buttons.map((item, index) => {
        if (selectedButtons[index]) {
            return(
                <input type="button" value={item} className='searchTagsButtonChecked' onClick={()=>{setSelectedButtons(index)}}/>
            );
        }
        return (
           <input type="button" value={item} className='searchTagsButton' onClick={()=>{setSelectedButtons(index)}}/>
        );
    });

    return (
        <div className='searchTags'>
            <div className='searchTagsSearchBar'>
                <input type='text' placeholder='Search for a trait' />
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
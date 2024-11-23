import { useUserSession } from '../utils/supabase';
import '../styles/EditButton.css';

interface EditButtonProps {
    isEditing: boolean,
    setIsEditing: Function,
    value: string,
    onClickDone?: Function,
  };

function EditButton({ isEditing, setIsEditing, value, onClickDone }: EditButtonProps) {
    if (isEditing) {
      if (onClickDone) {
        return (
          <button onClick={() => {setIsEditing(false); onClickDone("None")}} className='done'>Done</button>
        );
      } else {
        return (
          <button onClick={() => setIsEditing(false)} className='done'>Done</button>
        );
      }
    } else {
      return (
        <button onClick={() => setIsEditing(true)} className='manageButton'>{value}</button>
      );
    }
  }

export default EditButton;
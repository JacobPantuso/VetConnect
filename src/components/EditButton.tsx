import { useUserSession } from '../utils/supabase';
import '../styles/EditButton.css';

interface EditButtonProps {
    isEditing: boolean,
    setIsEditing: Function,
    value: string,
  };

function EditButton({ isEditing, setIsEditing, value }: EditButtonProps) {
    if (isEditing) {
      return (
        <button onClick={() => setIsEditing(false)} className='done'>Done</button>
      );
    } else {
      return (
        <button onClick={() => setIsEditing(true)} className='manageButton'>{value}</button>
      );
    }
  }

export default EditButton;
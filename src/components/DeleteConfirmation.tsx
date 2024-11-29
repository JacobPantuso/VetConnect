import '../styles/DeleteConfirmation.css';

interface DeleteConfirmation {
    value?: string;
    onYes: Function;
    onNo: Function;
};

function DeleteConfirmation({ value, onYes, onNo }: DeleteConfirmation) {
    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }

    return (
        <>
            <div className='deleteContainer'>
                <div className='deleteBackdrop'>
                </div>
                <div className='deleteConfirmation'>
                    <h2>{value ? value : "Are you sure you want to delete?"}</h2>
                    <div className='deleteConfirmationButtons'>
                        <input onClick={() => {onYes()}} type='button' value="Yes"></input>
                        <input onClick={()=> {onNo(null)}} type='button' value="No"></input>
                    </div>
                </div>
            </div>
        </>

    )
}

export default DeleteConfirmation;
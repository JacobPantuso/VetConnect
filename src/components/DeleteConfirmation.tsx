import '../styles/DeleteConfirmation.css';


function DeleteConfirmation() {
    return (
        <>
            <div className='deleteContainer'>
                <div className='deleteConfirmation'>
                    <h2>Are you sure you want to delete?</h2>
                    <div className='deleteConfirmationButtons'>
                        <input type='button' value="Yes"></input>
                        <input type='button' value="No"></input>
                    </div>
                </div>
            </div>

            <div className='deleteBackdrop'>
            </div>
        </>

    )
}

export default DeleteConfirmation;
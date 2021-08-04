const Textarea = (props) => {

    return (
            <div className="mb-3">
            <label htmlFor={props.name} className="form-label">
                {props.title}
            </label>
            <textarea 
                className="form-control" 
                id={props.id} 
                name={props.name} 
                rows="3" 
                onChange={props.handleChange}
                value={props.description}
            />
        </div>
    )
}

export default Textarea;
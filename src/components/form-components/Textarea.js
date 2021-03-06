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
                value={props.value}
                onChange={props.handleChange}
                rows={props.rows}
            />
        </div>
    )
}

export default Textarea;
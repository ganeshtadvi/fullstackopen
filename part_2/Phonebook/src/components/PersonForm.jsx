const PersonForm = (props) => {
  return (
    <div>
        <form onSubmit={props.onSubmit}>
      <div>
        name: <input value={props.newName} autoFocus onChange={props.onNameChange} />
        <div>
          number: <input value={props.newNumber} onChange={props.onNumberChange} />
        </div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
      </form>
    </div>
  );
};

export default  PersonForm;


// <PersonForm newName={newName} onNameChange={handleNameInput} 
// newNumber={newNumber} onNumberChange=
// {handleNumberInput} onSubmit={saveContact}/>
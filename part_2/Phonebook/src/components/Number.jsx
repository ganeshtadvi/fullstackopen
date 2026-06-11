const Number = ({ id,name,number,deleteContact }) => {
  return (
  <div>
  <li key={id}>{name} {number}</li>
  <button onClick={deleteContact}>delete</button>
  </div>)
};

export default Number;

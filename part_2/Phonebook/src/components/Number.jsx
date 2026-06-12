const Number = ({ id,name,number,deleteContact }) => {
  return (
  <div>
  <p key={id}>{name} {number} <button onClick={deleteContact}>delete</button></p>
  </div>)
};

export default Number;

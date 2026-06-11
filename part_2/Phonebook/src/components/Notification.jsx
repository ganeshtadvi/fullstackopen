const Notification = ({ msg,notificationType }) => {
  if (msg === null) {
    return null;
  }
  return <div className={notificationType}>{msg}</div>;
};

export default Notification;

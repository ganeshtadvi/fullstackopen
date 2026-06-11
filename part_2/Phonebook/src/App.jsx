import { useEffect, useState } from "react";
import Number from "./components/Number";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import contactService from "./services/persons";
import Notification from "./components/Notification";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterText, setFilterText] = useState("");
  const [msg, setMsg] = useState("");
  const [notificationType, setNotificationType] = useState("");

  useEffect(() => {
    contactService.getAllContacts().then((response) => setPersons(response));
  }, []);

  const saveContact = (event) => {
    event.preventDefault();
    const checkPerson = persons.find((p) => p.name === newName);
    if (checkPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook,replace the old number with a new one?`,
        )
      ) {
        const newContactObj = {
          ...checkPerson,
          number: newNumber,
        };
        contactService
          .updateContact(checkPerson.id, newContactObj)
          .then((response) => {
            setPersons(
              persons.map((p) => (p.id == checkPerson.id ? response : p)),
            );
            setMsg(`Updated ${checkPerson.name}`);
            setNotificationType("successful");
            setTimeout(() => {
              setMsg(null);
              setNotificationType(null);
            }, 4000);
          })
          .catch((err) => {
            setPersons(
              persons.filter((p) => p.id !== checkPerson.id)
            );
            setNotificationType("failed");
            setMsg(
              `Information of ${checkPerson.name} has already been removed from server`,
            );
            setTimeout(() => {
              setNotificationType(null);
              setMsg(null);
            }, 4000);
          });
      }
      return;
    }
    const newContact = {
      name: newName,
      number: newNumber,
    };
    contactService.saveContact(newContact).then((response) => {
      setPersons(persons.concat(response));
      setMsg(`Added ${response.name}`);
      setNotificationType("successful");
      setTimeout(() => {
        setMsg(null);
        setNotificationType(null);
      }, 4000);
    });
    setNewName("");
    setNewNumber("");
  };

  const deleteRequest = (id) => {
    const personName = persons.find((p) => p.id == id).name;
    if (window.confirm(`Delete ${personName} ?`)) {
      contactService
        .deleteContact(id)
        .then(() => setPersons(persons.filter((p) => p.id !== id)))
        .catch((err) => {
          setNotificationType("failed");
          setMsg(
            `Information of ${personName} has already been removed from server`,
          );
          setPersons(
            persons.filter((p) => p.id !== id)
          );
          setTimeout(() => {
            setNotificationType(null);
            setMsg(null);
          }, 4000);
        });
    }
  };

  const filterPersons = () => {
    return persons.filter((p) =>
      p.name.toLowerCase().includes(filterText.toLowerCase()),
    );
  };

  const handleFilterInput = (event) => {
    setFilterText(event.target.value);
  };

  const handleNameInput = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberInput = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification msg={msg} notificationType={notificationType} />
      <div>
        filter shown with{" "}
        <Filter value={filterText} onChange={handleFilterInput} />
      </div>

      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        onNameChange={handleNameInput}
        newNumber={newNumber}
        onNumberChange={handleNumberInput}
        onSubmit={saveContact}
      />
      <h2>Numbers</h2>
      <ul>
        {filterPersons().map((p) => (
          <Number
            key={p.id}
            name={p.name}
            number={p.number}
            deleteContact={() => {
              deleteRequest(p.id);
            }}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;

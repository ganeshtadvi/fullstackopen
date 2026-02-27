import { useState } from "react";

const Header = ({ heading }) => <h1>{heading}</h1>;

const Button = (props) => {
  return <button onClick={props.onClick}>{props.text}</button>;
};

const Anecdote = ({ text, votes }) => (
  <div>
    <p>{text}</p>
    <p>has {votes} votes</p>
  </div>
);

const MostVotedAnecdotes = (props) => {
  return (
    <div>
      <p>{props.text}</p>
      <p>{props.vote}</p>
    </div>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [allVotes, setAllVotes] = useState(new Array(anecdotes.length).fill(0));

  const maxVote = Math.max(...allVotes);
  const findMaxAnecdotes = anecdotes[allVotes.indexOf(maxVote)];

  const voteCounter = () => {
    const copyVotes = [...allVotes];
    copyVotes[selected] += 1;
    setAllVotes(copyVotes);
  };

  const pickAnecdotes = () => {
    let random = Math.floor(Math.random() * anecdotes.length);
    while (random === selected) {
      random = Math.floor(Math.random() * anecdotes.length);
    }
    setSelected(random);
  };

  return (
    <div>
      <Header heading="Anecdote of the day" />
      <Anecdote text={anecdotes[selected]} votes={allVotes[selected]} />
      <Button text="vote" onClick={voteCounter} />
      <Button text="next anecedotes" onClick={pickAnecdotes} />
      <Header heading="Anecdote with most votes" />
      <MostVotedAnecdotes text={findMaxAnecdotes} vote={maxVote} />
    </div>
  );
};

export default App;

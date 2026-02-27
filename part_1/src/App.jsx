import { useState } from "react";

const Header = (props) => {
  return <h1>{props.heading}</h1>;
};

const Statistics = ({ good, neutral, bad }) => {
  const totalFeedback = good + neutral + bad;

  if (totalFeedback === 0) {
    return <p>No feedback given</p>;
  }

  const average = (good * 1 + neutral * 0 + bad * -1) / totalFeedback;
  const positive = parseFloat(good / totalFeedback) * 100;

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={totalFeedback} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={`${positive} %`} />
      </tbody>
    </table>
  );
};

const StatisticLine = (props) => {
  return (
    <tr>
      <td> {props.text}</td>
      <td>{props.value}</td>
    </tr>
  );
};

const Button = (props) => {
  return <button onClick={props.onClick}>{props.feedback}</button>;
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const goodCounter = () => {
    setGood(good + 1);
  };
  const neutralCounter = () => {
    setNeutral(neutral + 1);
  };
  const badCounter = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <Header heading="give feedback" />
      <Button onClick={goodCounter} feedback="good" />
      <Button onClick={neutralCounter} feedback="neutral" />
      <Button onClick={badCounter} feedback="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;

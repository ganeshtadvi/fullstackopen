const Header = ({ header }) => {
  return <h1>{header}</h1>;
};

const Parts = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};
const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((p) => (
        <Parts key={p.id} part={p} />
      ))}
    </div>
  );
};

const Total = ({ parts }) => {
  let totalExercises = parts.reduce((s, p) => {
    return (s += p.exercises);
  }, 0);

  return (
    <p>
      <b>total of {totalExercises} exercises</b>
    </p>
  );
};

const Course = ({ course }) => {
  return (
    <div>
      <Header header={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;

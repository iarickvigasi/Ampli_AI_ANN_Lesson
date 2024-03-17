import React from 'react';
import Lesson from './Lesson';
import lessonData from './lesson.json';

const App = () => {
  return (
      <div>
        <Lesson title={lessonData.title} blocks={lessonData.blocks} />
      </div>
  );
};

export default App;

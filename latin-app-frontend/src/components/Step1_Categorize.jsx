// components/Step1_Categorize.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { saveAnswer, nextStep } from '../redux/translationSlice';

const Step1_Categorize = ({ text }) => {
  const dispatch = useDispatch();
  const options = ["Poetry", "History", "Philosophy", "Legal"];

  const handleSubmit = (choice) => {
    dispatch(saveAnswer({ step: 1, answer: choice }));
    // Here you could add logic to check if the answer is correct
    alert(`You chose: ${choice}. The correct genre is ${text.genre}.`);
    dispatch(nextStep());
  };

  return (
    <div>
      <h2>Step 1: What kind of text is this?</h2>
      {options.map(option => (
        <button key={option} onClick={() => handleSubmit(option)}>
          {option}
        </button>
      ))}
    </div>
  );
};

export default Step1_Categorize;
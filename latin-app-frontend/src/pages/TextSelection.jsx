import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

const TextSelection = () => {
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This fetches the texts you just added to the database
    axios.get('http://localhost:5000/api/texts')
      .then(response => {
        setTexts(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not fetch texts. Is the backend server running?');
        setLoading(false);
      });
  }, []); // The empty array [] means this effect runs only once

  if (loading) return <p>Loading texts...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (texts.length === 0) return <p>No texts found. Please add texts to the database.</p>;

  return (
    <div>
      <h1>Select a Text to Translate</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {texts.map(text => (
          <li key={text._id} style={{ margin: '10px 0' }}>
            {/* This Link creates a clickable URL like "/translate/some-id" */}
            <Link to={`/translate/${text._id}`} style={{ textDecoration: 'none', color: 'blue', fontSize: '1.2rem' }}>
              <strong>{text.title}</strong>
              <div style={{ fontSize: '0.9rem', color: 'gray' }}>by {text.author}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TextSelection;
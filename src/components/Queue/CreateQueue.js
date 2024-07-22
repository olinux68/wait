import React, { useState } from 'react';
import api from '../../api';

function CreateQueue() {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/create', { name });
      alert('Queue created successfully');
    } catch (error) {
      alert('Error creating queue');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Queue</h2>
      <input type="text" placeholder="Queue Name" value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Create</button>
    </form>
  );
}

export default CreateQueue;

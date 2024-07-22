
import React, { useState } from 'react';
import axios from 'axios';

function JoinQueue() {
  const [queueId, setQueueId] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3010/api/queue/${queueId}/join`, { name }, { withCredentials: true });
      alert(`Joined queue at position ${response.data.position}`);
    } catch (error) {
      console.error(error);
      alert('Error joining queue');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Join Queue</h2>
      <input type="text" placeholder="Queue ID" value={queueId} onChange={(e) => setQueueId(e.target.value)} />
      <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Join</button>
    </form>
  );
}

export default JoinQueue;

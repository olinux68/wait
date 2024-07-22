import React, { useState } from 'react';
import api from '../api';

function Position() {
  const [queueId, setQueueId] = useState('');
  const [userId, setUserId] = useState('');
  const [position, setPosition] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.get(`/api/${queueId}/position/${userId}`);
      setPosition(response.data.position);
    } catch (error) {
      alert('Error fetching position');
    }
  };

  return (
    <div>
      <h2>Get Position</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Queue ID" value={queueId} onChange={(e) => setQueueId(e.target.value)} />
        <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <button type="submit">Get Position</button>
      </form>
      {position !== null && <p>Your position is {position}</p>}
    </div>
  );
}

export default Position;

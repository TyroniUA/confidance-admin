import { useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent. Please check your inbox.');
      setError(null);
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };

  return (
    <div>
      <h1>Password Reset</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Send Password Reset Email</button>
      </form>
      {success && <div>{success}</div>}
      {error && <div>{error}</div>}
    </div>
  );
};
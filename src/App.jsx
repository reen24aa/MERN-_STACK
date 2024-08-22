import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import './styles.css';
import './loginSignup.css';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [accountExistsError, setAccountExistsError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        getTodos();
      } else {
        setTodos([]);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function getTodos() {
    try {
      const res = await fetch("/api/todos");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const todos = await res.json();
      setTodos(todos);
    } catch (error) {
      setError(error.message);
    }
  }

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo: newTodo }),
      });
      if (res.ok) {
        const newTodoItem = await res.json();
        setTodos([...todos, newTodoItem]);
        setNewTodo("");
      } else {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTodos(todos.filter(todo => todo._id !== id));
      } else {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCheckboxChange = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setTodos(todos.map(todo =>
          todo._id === id ? { ...todo, status: newStatus } : todo
        ));
      } else {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAuthError(null);
      setAccountExistsError(null);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setAuthError("Account does not exist.");
      } else {
        setAuthError("Failed to sign in. Check details.");
      }
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setAuthError(null);
      setAccountExistsError(null);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setAccountExistsError("Account already exists.");
      } else {
        setAuthError("Failed to sign up. check details");
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAuthError(null);
      setAccountExistsError(null);
      // Clear sensitive data
      setEmail("");
      setPassword("");
      // Optionally, redirect to sign-in page
    } catch (error) {
      setAuthError("Failed to sign out.");
    }
  };
  

  const completedTodos = todos.filter(todo => todo.status);
  const uncompletedTodos = todos.filter(todo => !todo.status);

  const allCompleted = uncompletedTodos.length === 0 && todos.length > 0;

  return (
    <main className="container">
      <h1 className="title">To-DoHaven</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {!user ? (
        <div className="auth-form-container">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${!isSignUp ? "active" : ""}`}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${isSignUp ? "active" : ""}`}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </div>
          {isSignUp ? (
            <div className="auth-form">
              {/* <h2>Sign Up</h2> */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <button onClick={handleSignUp}>Sign Up</button>
              {accountExistsError && <p className="error-message">{accountExistsError}</p>}
              {authError && <p className="error-message">{authError}</p>}
            </div>
          ) : (
            <div className="auth-form">
              {/* <h2>Sign In</h2> */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <button onClick={handleSignIn}>Sign In</button>
              {authError && <p className="error-message">{authError}</p>}
            </div>
          )}
        </div>
      ) : (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
          <div className="add-todo">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo"
            />
            <button onClick={handleAddTodo}>Add Todo</button>
          </div>

          {allCompleted && (
            <div className="celebration-message">
              <p>🎉 All tasks are completed! 🎉</p>
            </div>
          )}

          <section className="todo-section">
            <h2>Uncompleted Tasks</h2>
            {uncompletedTodos.length > 0 ? (
              uncompletedTodos.map((todo) => (
                <div key={todo._id} className="todo-item">
                  <p>{todo.todo}</p>
                  <div>
                    <input
                      type="checkbox"
                      checked={todo.status}
                      onChange={() => handleCheckboxChange(todo._id, todo.status)}
                    />
                    <button onClick={() => handleDelete(todo._id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No uncompleted tasks found</p>
            )}
          </section>

          <section className="todo-section">
            <h2>Completed Tasks</h2>
            {completedTodos.length > 0 ? (
              completedTodos.map((todo) => (
                <div key={todo._id} className="todo-item">
                  <p>{todo.todo}</p>
                  <div>
                    <input
                      type="checkbox"
                      checked={todo.status}
                      onChange={() => handleCheckboxChange(todo._id, todo.status)}
                    />
                    <button onClick={() => handleDelete(todo._id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No completed tasks found</p>
            )}
          </section>
        </>
      )}
    </main>
  );
}










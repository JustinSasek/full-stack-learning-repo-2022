import logo from './logo.svg';
import './App.css';
import DebugButton from "";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <DebugButton text = "click here"></DebugButton>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Don't Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

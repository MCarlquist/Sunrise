import { useState, useEffect } from 'react'
import './App.scss'

/**
 * Renders the Sunrise application's main UI, including theme selection, mood-based activity suggestions, and a counter.
 *
 * Provides a form for users to submit their mood and receive suggested activities, a dropdown to switch between visual themes, and a button to increment a counter. The selected theme is applied to the document root for dynamic styling.
 *
 * @returns The Sunrise application's React component.
 */
function App() {
  const themes = [
    { name: 'mytheme', label: 'My Theme' },
    { name: 'sunrise', label: 'Sunrise' },
    { name: 'light', label: 'Light' },
  ];
  const [selectedTheme, setSelectedTheme] = useState('sunrise');
  const [count, setCount] = useState(0)
  const [userMood, setUserMood] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedTheme);
  }, [selectedTheme]);

  const handleMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Call backend endpoint (to be implemented next)
    try {
      const res = await fetch("http://localhost:3000/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: userMood })
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setSuggestions(["Error fetching suggestions."]);
      console.log('It did not work Igor!');
      
    }
  };

  return (
    <>
      <h1>Sunr
      <h3>{selectedTheme}</h3>
      <form onSubmit={handleMoodSubmit} className="mb-4">
        <input
          type="text"
          className="input input-bordered w-64 mr-2"
          placeholder="How are you feeling?"
          value={userMood}
          onChange={e => setUserMood(e.target.value)}
        />
        <button type="submit" className="btn btn-accent">Get Activities</button>
      </form>
      {suggestions.length > 0 && (
        <div className="mt-4">
          <h4>Suggested Activities:</h4>
          <ul>
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="dropdown mb-72">
        <div tabIndex={0} role="button" className="btn m-1">
          Theme
          <svg
            width="12px"
            height="12px"
            className="inline-block h-2 w-2 fill-current opacity-60"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048"
          >
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
          </svg>
        </div>
        <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl">
          {themes.map((theme) => (
            <li key={theme.name}>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                aria-label={theme.label}
                value={theme.name}
                checked={selectedTheme === theme.name}
                onChange={() => setSelectedTheme(theme.name)}
              />
            </li>
          ))}
        </ul>
      </div>
      <p className="read-the-docs">
        Time to get started with <code>Sunrise</code>!<br />
        <button
          className="btn btn-primary btn-lg"
          style={selectedTheme === 'sunrise' ? { backgroundColor: '#ff0000', borderColor: '#ff0000', color: '#fff' } : {}}
          onClick={() => setCount((count) => count + 1)}
        >
      <div className="dropdown mb-72">
  <div tabIndex={0} role="button" className="btn m-1">
    Theme
    <svg
      width="12px"
      height="12px"
      className="inline-block h-2 w-2 fill-current opacity-60"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2048 2048">
      <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
    </svg>
  </div>
  <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl">
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label="Default"
        value="default" />
    </li>
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label="Retro"
        value="retro" />
    </li>
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label="Cyberpunk"
        value="cyberpunk" />
    </li>
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label="Valentine"
        value="valentine" />
    </li>
    <li>
      <input
        type="radio"
        name="theme-dropdown"
        className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
        aria-label="Aqua"
        value="aqua" />
    </li>
  </ul>
</div>
      <p className="read-the-docs">
        Time to get started with <code>Sunrise</code>!<br />
        <button className="btn btn-accent btn-lg" onClick={() => setCount((count) => count + 1)}>

          Count is: {count}
        </button>
      </p>
    </>
  )
}

export default App

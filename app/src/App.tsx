import { useState } from 'react'
import './App.scss'

/**
 * Renders the main application UI with a theme selection dropdown and a counter button.
 *
 * Displays a heading, a dropdown menu for selecting between multiple visual themes, a welcome message, and a button that increments and displays a count when clicked.
 *
 * @returns The rendered React component for the Sunrise application.
 */
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Sunrise</h1>
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

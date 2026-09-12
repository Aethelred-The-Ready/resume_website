import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'

// Some of these are just pre-existing html pages
function Resume() {
	window.location.href = '/resume.html'
	return <div></div>
}

function RocketEquation() {
	window.location.href = '/rocket-equation.html'
	return <div></div>
}

function CrucibleBlanketCalculator() {
	window.location.href = '/crucible-blanket-calculator.html'
	return <div></div>
}

function App() {
  return (
    <>
      <BrowserRouter>
	  	<Routes>
			<Route path="/" element={<Resume />} />
			<Route path="/crucible-blanket-calculator" element={<CrucibleBlanketCalculator />} />
			<Route path="/rocket-equation" element={<RocketEquation />} />
		</Routes>
	  </BrowserRouter>
    </>
  )
}

export default App

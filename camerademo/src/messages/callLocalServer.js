export function callPythonCoverDemo () {
    fetch(`http://localhost:8000/startPython`, {
        credentials: 'same-origin',
        method: 'GET'
    })
}
export function callCppCoverDemo () {
    fetch(`http://localhost:8000/start`, {
        credentials: 'same-origin',
        method: 'GET'
    })
}

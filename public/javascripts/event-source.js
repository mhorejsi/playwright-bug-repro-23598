
const evtSource = new EventSource("/api/foo/sse");

evtSource.onmessage = (event) => {
    const newElement = document.createElement("b");
    newElement.setAttribute("id", "sse-id");
  
    newElement.textContent = `message: ${event.data}`;

    document.body.appendChild(newElement);
};

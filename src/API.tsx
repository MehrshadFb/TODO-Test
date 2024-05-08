async function fetchText(url: "https://jsonplaceholder.typicode.com/todos"): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('An error occurred: ' + response.statusText);
    }
    return await response.text();
}

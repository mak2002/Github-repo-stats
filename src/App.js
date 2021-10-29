import { useState } from 'react';
import './App.css';


function App() {

  const [url, seturl] = useState();

  const handleClick = () => {
    var a = document.createElement('a')
    a.setAttribute('href', url)
    var protocol = a.protocol
    var domain = a.domain
    var pathname = a.pathname
    
    const owner = pathname.match(/(?<=\/)(.*?)(?=\/)/)
    
    const repo = pathname.match(/^(?:\/(.+)){2}/)
    
    
    console.log('url : ', url)
    console.log('pathname', pathname)
    console.log('owner : ', owner[0])
    console.log('repo : ', repo[1])

  }

  return (
    <div className="App bg-gray-500 h-screen" >

      <label htmlFor="url" className="text-3xl font-bold m-4 ">Github Repo URL</label>
      <input type="text" className="h-8 p-5 w-8/12" id="url" onChange={(e) => seturl(e.target.value)} placeholder="Enter Github Repo URL"/>
      <button className="bg-blue-600 p-2 " onClick={handleClick}>Get Stats</button>

    </div>
  );
}

export default App;

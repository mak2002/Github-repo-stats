import { useState } from "react";
import "./App.css";

function App() {
  const [url, seturl] = useState();
  const [owner, setowner] = useState();
  const [repo, setrepo] = useState();
  const [branch, setbranch] = useState('main');
  const [repoInfo, setrepoInfo] = useState();
  const [isReadme, setisReadme] = useState();
  const [issues, setissues] = useState();

  const [lastCommit, setlastCommit] = useState();
  const [WeeklyCommits, setWeeklyCommits] = useState();

  const handleClick = () => {
    var a = document.createElement("a");
    a.setAttribute("href", url);
    var pathname = a.pathname;

    const owner = pathname.match(/(?<=\/)(.*?)(?=\/)/);
    setowner(owner[0]);

    const repo = pathname.match(/^(?:\/(.+)){2}/);
    setrepo(repo[1]);

    fetchCommit(owner[0], repo[1]);
    fetchWeeklyCommits(owner[0], repo[1]);
    fetchIssues(owner[0], repo[1])
    fetchRepo(owner[0], repo[1]);
    fetchReadme(owner[0], repo[1])

    console.log('issues : ', issues);
  };

  const fetchCommit = (owner, repo) => {
    fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${branch}`)
    .then((data) => data.json())
    .then((data) => setlastCommit(data.commit.author.date));
    
  };

  const fetchWeeklyCommits = (owner, repo) => {
    fetch(`https://api.github.com/repos/${owner}/${repo}/stats/participation`)
    .then((data) => data.json())
    .then((data) => setWeeklyCommits(data.all[data.all.length - 1]))
  }

  const filterIssue = (issues) => {
    issues.map((issue) => {
      if (!issue.hasOwnProperty('pull_request')) {
        console.log('issue pull request : ',issue)
        setissues([...issues, issue])
      }
    })
  }

  const fetchIssues = (owner, repo) => {
    fetch(`https://api.github.com/repos/${owner}/${repo}/issues`)
    .then((data) => data.json())
    // .then((data) => setissues(data))
    // .then((data) => console.log(data))
    .then((data) => filterIssue(data))

  }

  const fetchRepo = (owner, repo) => {
    fetch(`https://api.github.com/repos/${owner}/${repo}`)
    .then((data) => data.json())
    .then((data) => setrepoInfo(data.created_at))

    console.log()
  }

  const fetchReadme = (owner, repo) => {
    fetch(`https://api.github.com/repos/${owner}/${repo}/readme`)
    .then((data) => {
      if(data.status === 404) {
        setisReadme(false);
      }
      else{
        setisReadme(true);
      }
    })
  }
 
  return (
    <div className="App bg-gray-500 h-screen">
      <div className="content-wrapper p-5 h-screen">
        <label htmlFor="url" className="text-3xl font-bold m-4 ">
          Github Repo URL
        </label>
        <input
          type="text"
          className="h-8 p-5 w-8/12"
          id="url"
          onChange={(e) => seturl(e.target.value)}
          placeholder="Enter Github Repo URL"
        />

        <select className="p-2.5 font-xl" name="" id="" onChange={(e) => setbranch(e.target.value)}>
          <option value="main" font-2lg="true">main</option>
          <option value="master" font-2lg="true">master</option>
        </select>

        <button className="bg-blue-600 p-2 " onClick={handleClick}>
          Get Stats
        </button>

        {lastCommit && <h3>Last Commit: {lastCommit}</h3>}
        {WeeklyCommits && <h2>Weekly Commit: {WeeklyCommits}</h2>}
        {repoInfo && <h2>Repository Created at : {repoInfo}</h2>}
        {isReadme ? <h2>Readme Available</h2> : <h2>Readme Not Available</h2>}
      </div>
    </div>
  );
}

export default App;

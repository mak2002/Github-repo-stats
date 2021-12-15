import { useState } from "react";
import "./App.css";

function App() {
  const [url, seturl] = useState();
  const [owner, setowner] = useState();
  const [repo, setrepo] = useState();
  const [branch, setbranch] = useState("main");
  const [repoInfo, setrepoInfo] = useState();
  const [isReadme, setisReadme] = useState();
  const [issues, setissues] = useState([]);

  const [filteredIssues, setfilteredIssues] = useState([]);
  const [filteredIssues1, setfilteredIssues1] = useState([]);

  const [lastCommit, setlastCommit] = useState();
  const [WeeklyCommits, setWeeklyCommits] = useState();

  var tempArray = [];

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
    fetchIssues(owner[0], repo[1]);
    fetchRepo(owner[0], repo[1]);
    fetchReadme(owner[0], repo[1]);

    console.log("issues : ", filteredIssues.length);
  };

  const fetchCommit = (owner, repo) => {
    fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${branch}`)
      .then((data) => data.json())
      .then((data) => setlastCommit(data.commit.author.date));
  };

  const fetchWeeklyCommits = (owner, repo) => {
    fetch(`https://api.github.com/repos/${owner}/${repo}/stats/participation`)
      .then((data) => data.json())
      .then((data) => setWeeklyCommits(data.all[data.all.length - 1]));
  };

  var count = 0;
  const filterIssue = (issues) => {
    issues.map((issue) => {
      if (!issue.hasOwnProperty("pull_request")) {
        console.log("issue pull request : ", issue);
        tempArray.push(issue);
        setfilteredIssues(tempArray);
      }
    });
  };

  const fetchIssues = (owner, repo) => {
    fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?labels=$good first issue`
    )
      .then((data) => data.json())
      // .then((data) => setissues(data))
      // .then((data) => console.log(data))
      .then((data) => filterIssue(data));
  };

  const fetchIssues1 = (owner, repo) => {
    fetch(`https://api.github.com/repos/${owner}/${repo}/issues?labels=easy`)
      .then((data) => data.json())
      .then((data) => filterIssue(data));
  };

  const fetchRepo = (owner, repo) => {
    fetch(`https://api.github.com/repos/${owner}/${repo}`)
      .then((data) => data.json())
      .then((data) => setrepoInfo(data.created_at));

    console.log();
  };

  const fetchReadme = (owner, repo) => {
    fetch(`https://api.github.com/repos/${owner}/${repo}/readme`).then(
      (data) => {
        if (data.status === 404) {
          setisReadme(false);
        } else {
          setisReadme(true);
        }
      }
    );
  };

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

        <select
          className="p-2.5 font-xl"
          name=""
          id=""
          onChange={(e) => setbranch(e.target.value)}
        >
          <option value="main" font-2lg="true">
            main
          </option>
          <option value="master" font-2lg="true">
            master
          </option>
          <option value="gh-pages" font-2lg="true">
            gh-pages
          </option>
          <option value="dev" font-2lg="true">
            dev
          </option>
        </select>

        <button className="bg-blue-600 p-2 " onClick={handleClick}>
          Get Stats
        </button>

        <div className="repo-info flex-col justify-start">
          {lastCommit && (
            <p className="text-2xl font-bold">Last Commit: {lastCommit}</p>
          )}
          {WeeklyCommits ? (
            <p className="text-2xl font-bold">
              Weekly Commit Activity: {WeeklyCommits}
            </p>
          ) : (
            <p className="text-2xl font-bold">Weekly Commit Activity: 0</p>
          )}

          {repoInfo && (
            <p className="text-2xl font-bold">
              Repository Created at : {repoInfo}
            </p>
          )}
          {isReadme ? (
            <h1 className="text-2xl font-bold">Readme Available &#128077;</h1>
          ) : null}
          {filteredIssues ? (
            filteredIssues.map((issue) => <p>Issue: {issue.title}</p>)
          ) : (
            <p className="text-2xl font-bold">No Issue</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

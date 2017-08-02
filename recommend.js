var request = require('request');
var fs = require('fs');
require('dotenv').config();

var args = process.argv.slice(2);

const GITHUB_USER = process.env.USERNAME;
const GITHUB_TOKEN = process.env.TOKEN;

let totalNumberOfContributors = 0;
let contributorsSoFar = 0;

if(!GITHUB_USER || !GITHUB_TOKEN){
  console.log("Error with .env file, please create .env file with the format:\nUSERNAME:<GitHub Username\nTOKEN:<GitHub Token>");
  process.exit();
}

const USER_AGENT = { 'User-Agent': 'MattWillcox' };

console.log('Welcome to the GitHub Avatar Downloader!');

function returnMax(list){
  const modeMap = {};
  let maxEl = [];
  let maxCount = 1;
  for(let k in list){
    var el = list[k];

    if (modeMap[el] == null)
        modeMap[el] = 1;
    else
        modeMap[el]++;

    if (modeMap[el] > maxCount)
    {
        maxEl = [el];
        maxCount = modeMap[el];
    }
    else if (modeMap[el] == maxCount && maxEl[0] !== el)
    {
        maxEl.push(el);
    }
  }
    console.log(maxEl);
    return maxEl;
}

function countRepos(list, cb) {
  let reposList = [];
  let newList = [];
  for (let i of list){
    //console.log(`https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/users/${i}/starred`);
    request({ url: `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/users/${i}/starred`,
    headers: USER_AGENT }, function(err, response, body) {
      if (err) {
        throw err;
      }
      for(let j of JSON.parse(body)){
        reposList.push(j.name);
      }
      (cb(reposList));
    });
  }
}

function sortRepoCounts(tracker) {
  let rankedRepoNames = Object.keys(tracker).sort(function compareCounts(a, b) {
    return tracker[b] - tracker[a];
  });
  if (contributorsSoFar == totalNumberOfContributors) {
    console.log('Top 5 repos:');
    rankedRepoNames.slice(0, 5).forEach(function (repoName) {
      console.log('[' + tracker[repoName], "stars] -", repoName.replace('/', ' / '));
    });
  }
}

function getStarredRepos(user, collectReposCB, tracker) {
  request({
    url: `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/users/${user}/starred`,
    headers: USER_AGENT
  }, function (err, response, body) {
    if (err) {
      throw err;
    }
    collectReposCB(JSON.parse(body), tracker);
    // console.log('repo counts:', JSON.stringify(tracker));
    sortRepoCounts(tracker);
  });
}

function processRepos(repoList, tracker) {
  // console.log('body:', repoList);
  var repoFullNames = repoList.map(function getFullName(repo) {
    return repo.full_name;
  });
  repoFullNames.reduce(function (acc, repoName) {
    acc[repoName] = acc[repoName] ? (acc[repoName] + 1) : 1;
    return acc;
  }, tracker);
  contributorsSoFar++;
  // repoFullNames.forEach(function addToTracker(repoName) {
  //   tracker[repoName] = tracker[repoName] ? (tracker[repoName] + 1) : 1;
  // });
}

function findStarredReposForContributors(data){
  var contributorList = data.map(function (cont) {
    return cont.login
  });
  console.log('list in findRepos:', contributorList);
  var repoTracker = {};
  totalNumberOfContributors = contributorList.length;
  contributorList.forEach(function (contributor) {
    getStarredRepos(contributor, processRepos, repoTracker);
  });
  // data.forEach(function(cont){

  //   list.push(cont.login);
  // });
  // console.log(countRepos(contributorList, returnMax));
}

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = { url: `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`,
  headers: USER_AGENT
  };

  request(requestURL, function(err, response, body) {
    if (err){
      throw err;
    }
    if(response.statusCode != 200){
      console.log("Incorrect owner or repository name, please verify");
      process.exit();
    }

    cb(JSON.parse(body));

  });
}

(!args[0] || !args[1] || args.length > 2) ?
  console.log("Error, Incorrect Command Line Arguments. \nPlease enter: node download_avatars.js <owner> <repo>")
  : getRepoContributors(args[0], args[1], findStarredReposForContributors);
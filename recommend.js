var request = require('request');
var fs = require('fs');
require('dotenv').config();

var args = process.argv.slice(2);

const GITHUB_USER = process.env.USERNAME
const GITHUB_TOKEN = process.env.TOKEN

if(!GITHUB_USER || !GITHUB_TOKEN){
  console.log("Error with .env file, please create .env file with the format:\nUSERNAME:<GitHub Username\nTOKEN:<GitHub Token>");
  process.exit();
}

const USER_AGENT = { 'User-Agent': 'MattWillcox' };

console.log('Welcome to the GitHub Avatar Downloader!');

function countRepos(list) {
  list.forEach(function(index){
    request({ url: index,
    headers: USER_AGENT
    }, function(err, response, body) {
      if (err) {
        throw err;
      }

    console.log(JSON.parse(body));

    })
  };
}

function findRepos(data){
  var urlArray = [];
  data.forEach(function(cont){
    urlArray.push(cont.starred_url.slice(0, -15));
  });
  countRepos(urlArray);

}

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = { url: 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN +
  '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
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
  : getRepoContributors(args[0], args[1], findRepos);
var request = require('request');

var GITHUB_USER = "MattWillcox";
var GITHUB_TOKEN = "a6ebeb0a66e22a53501a2c7fb5647fc7d34bef5d";

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN +
   '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
   console.log(requestURL);
}

getRepoContributors('jquery', 'jquery', function(err){
  console.log(err);
});
var request = require('request');
var fs = require('fs');

const GITHUB_USER = "MattWillcox";
const GITHUB_TOKEN = "a6ebeb0a66e22a53501a2c7fb5647fc7d34bef5d";
const USER_AGENT = { 'User-Agent' : 'MattWillcox' };

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = { url : 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN +
   '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
   headers :  USER_AGENT
  }

  request(requestURL, function(err, response, body) {
    if (err) throw err;

    console.log('Response Status Code:', response.statusCode);

    cb(JSON.parse(body));

  });
}

function findAvatar(data){
  data.forEach(function(cont){
      downloadImageByURL(cont.avatar_url, cont.login);
  })
}

function downloadImageByURL(url, filePath) {
  request(url + '.jpeg', function(err, response, body) {
  if (err) throw err;
  //console.log('Avatar Response Status Code: ', response.statusCode);
  }).pipe(fs.createWriteStream('./avatars/' + filePath + '.jpeg'));
}

getRepoContributors('jquery', 'jquery', findAvatar);
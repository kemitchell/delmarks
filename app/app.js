(function() {
  var connect, deleteLink, fs, help, loadDelicious, newLink, parseAll, parseAllResponse, url, _;

  fs = require('fs');

  url = require('url');

  _ = require('underscore');

  loadDelicious = function() {
    var data;
    if (!this.user) {
      try {
        data = fs.readFileSync('./config.json');
        this.user = JSON.parse(data);
      } catch (_error) {
        return false;
      }
    }
    process.env.DELICIOUS_USER = this.user.username;
    process.env.DELICIOUS_PASSWORD = this.user.password;
    this.nodedelicious = require('nodedelicious');
    return true;
  };

  parseAll = function() {
    if (loadDelicious()) {
      return this.nodedelicious.getAllPosts("", "", function(err, data) {
        if (!err) {
          return parseAllResponse(data);
        }
      });
    } else {
      return console.log("Please connect first, try running 'delmarks connect username password");
    }
  };

  parseAllResponse = function(data) {
    var posts;
    if (data.posts) {
      posts = data.posts.post;
      return _.each(posts, function(link) {
        return console.log(link.$.href);
      });
    } else {
      return console.log(data);
    }
  };

  deleteLink = function(link) {
    if (loadDelicious()) {
      return nodedelicious.deletePost(link, function(err, data) {
        if (!err) {
          return console.log("Gone :)");
        }
      });
    } else {
      return console.log("Please connect first, try running 'delmarks connect username password");
    }
  };

  newLink = function(link) {
    if (loadDelicious()) {
      link = url.parse(link);
      return nodedelicious.addPost(link.href, link.hostname, function(err, data) {
        if (!err) {
          return console.log("Done :)");
        }
      });
    } else {
      return console.log("Please connect first, try running 'delmarks connect username password");
    }
  };

  connect = function(username, password) {
    var data;
    this.user = {
      username: username,
      password: password
    };
    data = JSON.stringify(user);
    fs.writeFile('./config.json', data, function(err) {
      if (err) {
        return console.log(err.message);
      }
    });
    return loadDelicious();
  };

  help = function() {
    console.log("Delmarks: A node based command line tool for managing your Del.iciou.us bookmarks (0.1.5)");
    console.log("-----------------------------------------------------------------------------------------");
    console.log("connect USERNAME PASSWRD: Connect your account");
    console.log("ls: List your bookmarks");
    console.log("add http://google.ca: Add a new bookmark");
    return console.log("remove http://google.ca: Removes a bookmark");
  };

  switch (process.argv[2]) {
    case "ls":
      parseAll();
      break;
    case "remove":
      deleteLink(process.argv[3]);
      break;
    case "add":
      newLink(process.argv[3]);
      break;
    case 'connect':
      connect(process.argv[3], process.argv[4]);
      break;
    default:
      help();
  }

}).call(this);

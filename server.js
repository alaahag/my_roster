const express = require('express');
const path = require('path');
const urllib = require('urllib');

const ip = '0.0.0.0';
const port = 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
// app.use(function(req, res, next)
// {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

let players;
let players_stats;
const teamToIDs =
{
    "lakers": "1610612747",
    "warriors": "1610612744",
    "heat": "1610612748",
    "suns": "1610612756"
};


urllib.request('http://data.nba.net/10s/prod/v1/2018/players.json', function(err, data)
{
    const playersObj = JSON.parse(data);
    players = playersObj.league.standard;
});

urllib.request('https://nba-players.herokuapp.com/players-stats', function(err, data)
{
    players_stats = JSON.parse(data);
});


app.get('/teams/:teamName', function(req, res)
{
    //we need: teamId firstName lastName jersey pos
    const teamName = req.params.teamName;
    const teamID = teamToIDs[teamName];

    const results = [];
    if (teamID)
    {
        for (let team of players)
        {
            if (team.teamId === teamID && team.isActive == true)
                results.push({firstName: team.firstName, lastName: team.lastName, jersey: team.jersey, pos: team.pos});
        }
    }
    res.send(results);
});

app.get('/playerStats/:player', function(req, res)
{
    // https://nba-players.herokuapp.com/players-stats/{{lastName}}/{{firstName}}
    const playerFullName = req.params.player;
    const results = [];

    if (playerFullName)
        results.push(players_stats.find(p => p.name === playerFullName));

    res.send(results);
});


app.listen(port, ip, function()
{
    console.log(`server is running on IP: '${ip}' port: '${port}'`);
});
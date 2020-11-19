//solved all exercises including extensions and challenges

const express = require('express');
const urllib = require('urllib');
const router = express.Router();

const teamToIDs =
{
    "lakers": "1610612747",
    "warriors": "1610612744",
    "heat": "1610612748",
    "suns": "1610612756"
};

let players;
let players_stats;
let dreamTeam = [];

urllib.request('http://data.nba.net/10s/prod/v1/2018/players.json', function(err, data)
{
    const playersObj = JSON.parse(data);
    players = playersObj.league.standard;
});

urllib.request('https://nba-players.herokuapp.com/players-stats', function(err, data)
{
    players_stats = JSON.parse(data);
});

router.get('/teams/:teamName', function(req, res)
{
    //we need: teamId firstName lastName jersey pos
    const teamName = req.params.teamName;
    const teamID = teamToIDs[teamName];

    const results = [];
    if (teamID)
    {
        for (const player of players)
        {
            if (player.teamId === teamID && player.isActive == true)
                results.push({firstName: player.firstName, lastName: player.lastName, jersey: player.jersey, pos: player.pos});
        }
    }
    res.send(results);
});

router.get('/playerStats/:player', function(req, res)
{
    const playerFullName = req.params.player;
    const results = [];

    if (playerFullName)
        results.push(players_stats.find(p => p.name === playerFullName));

    res.send(results);
});

router.put('/team', function(req, res)
{
    // we supposed to get object like this: {teamName: NAME, teamId: ID}
    //we can test by adding these teams:
    //wizards - "1610612764"
    //raptors - "1610612761"
    //spurs - "1610612759"
    //rockets - "1610612745"
    const teamName = req.body.teamName;
    const teamId = req.body.teamId;
    if (!teamToIDs.teamName)
        teamToIDs[teamName] = teamId;

    res.send(teamToIDs);
});

router.get('/dreamTeam', function(req, res)
{
    //get only top 5 players of dream team and return them
    dreamTeam = dreamTeam.splice(0,5);
    res.send(dreamTeam);
});

router.post('/roster', function(req, res)
{
    // should be something like this: {firstName: [firstName], lastName: [lastName], jersey: [jersey], pos: [pos]}
    const player = req.body;
    for (const p of dreamTeam)
    {
        if (p.firstName === player.firstName && p.lastName === player.lastName)
        {
            //found existing player, return null
            res.send(null);
            return;
        }
    }
    dreamTeam.unshift(player);
    res.send(`${player.firstName} ${player.lastName}`);
});

router.delete('/roster', function(req, res)
{
    // should be something like this: {firstName: [firstName], lastName: [lastName], jersey: [jersey], pos: [pos]}
    const player = req.body;
    for (let i=0; i<dreamTeam.length; i++)
    {
        if (dreamTeam[i].firstName === player.firstName && dreamTeam[i].lastName === player.lastName)
        {
            //found existing player, we will delete it
            dreamTeam.splice(i, 1);
            res.send(player);
            return;
        }
    }
    //else
    res.send(null);
});

module.exports = router;
//init globals so we don't have to find them in DOM again (for more performance)
let btn_roster;
let btn_dream_team;
let txt_search;
let modal;
let modal_content;
let content;

const btnLoadDataClick = function(e)
{
    //btn_roster or btn_dream_team
    let getData = e.currentTarget.id === "btn_roster" ? `/teams/${txt_search.val()}` : "/dreamTeam";

    $.get(getData, function(data)
    {
        //teamId firstName lastName jersey pos
        content.empty();
        const template = Handlebars.compile($('#playersData-template').html());
        content.append(template(data));
    });
};

const btnAddRemoveToDreamTeamClick = function(e)
{
    const sender = e.currentTarget;
    const playerJSON = $(sender).data("id");

    //we add or remove (depends on text button)
    if (sender.textContent.indexOf("Add") !== -1)
    {
        //add
        $.post("/roster", playerJSON, function(player)
        {
            player ? setTimeout((function(){alert(`"${player}" has been successfully added to the top 5 players in Dream Team!`);}), 200) : setTimeout((function(){alert(`This player is already exists in Dream Team!`);}), 200);
        });
    }
    else
    {
        //delete
        $.ajax(
        {
            url: '/roster',
            type: 'DELETE',
            dataType: 'json',
            data: playerJSON,
            success: function (data)
            {
                if (data)
                    setTimeout((function (){alert(`"${data.firstName} ${data.lastName}" has been removed from Dream Team!`);}), 200);
            }
        });
    }
};

const showStats = function(sender)
{
    const playerName = sender.title;
    $.get(`/playerStats/${playerName}`, function(data)
    {
        if (data[0])
            data[0].fulldata = $(sender).data("id");
        else
        {
            //if no data results for player then empty array and push only JSON of the player to it
            data.splice(0, data.length);
            data.push({fulldata: $(sender).data("id")});
        }

        modal_content.empty();
        modal.fadeIn(200);
        const template = Handlebars.compile($('#playersStats-template').html());
        modal_content.append(template(data));
    });
};

const modalHide = function(event)
{
    if ($(event.target).is(".modal") || $(event.target).is(".close") || $(event.target).is("#btn_add_remove_dream_team"))
        modal.fadeOut(200);
};

Handlebars.registerHelper("alert", function(string)
{
    alert(string);
});

Handlebars.registerHelper('toJSON', function(object)
{
    return new Handlebars.SafeString(JSON.stringify(object));
});

Handlebars.registerHelper('ifExistsInDreamTeam', function(firstName, lastName)
{
    let isFound = false;
    $.get('/dreamTeam', function(dreamData)
    {
        //check if player exists in dream team
        for (const p of dreamData)
        {
            if (p.firstName === firstName && p.lastName === lastName)
            {
                //found existing player, we show the "add to dream team" or "remove from dream team" button
                isFound = true;
                break;
            }
        }
        isFound ? $("#btn_add_remove_dream_team").text("Remove from Dream Team").addClass("remove_dream_color") : $("#btn_add_remove_dream_team").text("Add to Dream Team").removeClass("remove_dream_color");
    });
});

$(function()
{
    //init
    txt_search = $("#txt_search");
    btn_roster = $("#btn_roster");
    btn_dream_team = $("#btn_dream_team");
    modal = $(".modal");
    modal_content = $(".modal-content");
    content = $(".content");

    //close modal if clicked on background or X button
    modal_content.on('click', ".close", modalHide);
    modal_content.on('click', "#btn_add_remove_dream_team", btnAddRemoveToDreamTeamClick);
    $(window).click(modalHide);

    //click on Get Roster and Dream Team
    btn_roster.click(btnLoadDataClick);
    btn_dream_team.click(btnLoadDataClick);
});
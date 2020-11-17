//init globals so we don't have to find them in DOM again (for more performance)
let btn_roster;
let txt_search;
let modal;
let modal_content;
let content;

const btnLoadDataClick = function()
{
    $.get(`/teams/${txt_search.val()}`, function(data)
    {
        //teamId firstName lastName jersey pos
        content.empty();
        const template = Handlebars.compile($('#playersData-template').html());
        content.append(template(data));
    });
};

const showStats = function(sender)
{
    const playerName = sender.title;
    $.get(`/playerStats/${playerName}`, function(data)
    {
        modal_content.empty();
        modal.css("display", "block");
        const template = Handlebars.compile($('#playersStats-template').html());
        modal_content.append(template(data));
    });
};

const modalHide = function(event)
{
    if ($(event.target).is(".modal") || $(event.target).is(".close"))
        modal.css("display", "none");
};

Handlebars.registerHelper("alert", function(string)
{
    alert(string);
});

$(function()
{
    //init
    txt_search = $("#txt_search");
    btn_roster = $("#btn_roster");
    modal = $(".modal");
    modal_content = $(".modal-content");
    content = $(".content");

    //close modal if clicked on background or X button
    modal_content.on('click', ".close", modalHide);
    $(window).click(modalHide);

    //click on Get Roster
    $("#btn_roster").click(btnLoadDataClick);
});
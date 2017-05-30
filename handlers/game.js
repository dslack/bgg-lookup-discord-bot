const bgg = require('../bgg');
const GameFormatter = require('../formatters/game')

module.exports = function handleGame(channel, {action: action, command: command}) {
    channel.send(`Searching for '${command}'`)
    bgg('search', {query: command, type: 'boardgame'}).then(res => {
      if (res.items.total === 1) {
        res.items.item = [res.items.item];
      }
      if (res.items.total > 0 && res.items.item) {
        let items = res.items.item;
        items = items.filter((i,idx) => idx < 10)
          .map(i => {
            return i.id;
          });
        retrieveGames(items).then(games => {
          games.forEach(g => {
            channel.send(g);
          })
        });
        
      } else {
        channel.send("NoGames");
      }
    })
}

function retrieveGames(gameIds) {
  let path = gameIds.join(",");
  return bgg('thing',{id:path, stats:1, type: "boardgame,boardgamexpansion"}).then(res => {
    let items = Array.isArray(res.items.item) ? res.items.item : [res.items.item];
    return items
      .sort((a,b) => b.statistics.ratings.average.value - a.statistics.ratings.average.value)
      .map(i => GameFormatter(i));
  }, err => console.error);
}

function formatGame(item) {
  item.name = Array.isArray(item.name) ? item.name.find(i => i.type === 'primary') : item.name;
  return {embed: {
    color:344703,
    url:`https://boardgamegeek.com/boardgame/${item.id}`,
    title:item.name.value,
    fields:[
      {
        name:"BGG Average",
        value:""+item.statistics.ratings.average.value
      }, {
        name:"Weight",
        value: ""+item.statistics.ratings.averageweight.value
      }
    ]
  }};
}
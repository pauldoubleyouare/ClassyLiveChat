require('dotenv').config();
const agents = require('./agents');
const chats = require('./chats');

/*
  TO DO:
  1) Function that takes JSON as param and generates CSV
*/

// fetch arr of agents
agents.request_livechat_agents().then(agents => {
  agents.forEach(agent => {
    // fetch chats for each agent
    chats.agent_chats(agent)
    .then(res => {
      console.log("\nAgent: ", agent);
      console.log("chats length", res.length);

      // download CSV

    })
    .catch(err => {
      console.log("error fetching agent chats: ", err);
    })
  })
})


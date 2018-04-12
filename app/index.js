require('dotenv').config();
const agents = require('./agents');
const chats = require('./chats');

/*
  TO DO:

  1) Function that takes JSON as param and generates CSV

*/

// fetch arr of agents
console.log("is array or promise: ", agents.request_livechat_agents())

// .forEach(agent => {
//   // fetch chats for each agent
//   chats.agent_chats(agent)
//     .then(res => {
//       console.log("\n\n\n\n\nAgent: ", agent);
//       console.log("chats length", res.length);

//       // download CSV

//     })
//     .catch(err => {
//       console.log("Error fetching agent chats: ", err);
//     })
// })
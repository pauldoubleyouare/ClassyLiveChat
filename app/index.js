require('dotenv').config();
const agents = require('./agents');
const chats = require('./chats');

/*
  Iterate through an array of agents and build allAgentChats:
  {
    agent: [chats],
    agent: [chats],
    etc
  }
*/
var testAgents = ['bhaas@classy.org'];

testAgents.forEach(agent => {
  chats.agent_chats(agent)
    // response should be an array of that agent's chats
    .then(res => {
      // print JSON for that agent
      // console.log("\n\n\nAgent: ", agent);
      // console.log("Chats length: ", res.length);
      // new function to build all agents object
    })
    .catch(err => {
      console.log("Error fetching agent chats: ", err);
    })
})

// let allAgentChats = {};
// agents.request_livechat_agents()
// .then((res) => {
//   // FOR EACH AGENT, CALL REQUEST_AGENT_CHATS(agent) 
//   res.forEach((agent) => {
//     // console.log("AGENT: ", agent);
//     agent_chats(agent);
//   })

// })




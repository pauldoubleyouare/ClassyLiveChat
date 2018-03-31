require('dotenv').config();
const agents = require('./agents');
const chats = require('./chats');

/*
  Iterate through arr of agents and build allAgentChats:
  {
    agent: [chats],
    agent: [chats],
    etc
  }
*/
var testAgents = ['bhaas@classy.org', 'stelfer@classy.org'];

testAgents.forEach(agent => {
  chats.agent_chats(agent)
    // response should be all of that agent's chats
    .then(res => {
      console.log("\n\n\nAgent: ", agent);
      console.log("Chats? ", res);
    })
    .catch(err => {
      console.log("Error fetching agent: ", err);
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




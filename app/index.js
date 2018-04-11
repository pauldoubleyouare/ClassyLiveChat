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
  // fetch an array of each agent's chats
  chats.agent_chats(agent)
    .then(res => {
      // print JSON for that agent
      console.log("\n\n\n\n\nAgent: ", agent);


      // ERRORING B/C NOT ASYNC
      // console.log("Chats: ", res.length);

      
      // new function to build all agents object
    })
    .catch(err => {
      console.log("Error fetching agent chats: ", err);
    })
})

// ~~~ Once works for one agent, implement for all ~~~
// let allAgentChats = {};
// agents.request_livechat_agents()
// .then((res) => {
//   // FOR EACH AGENT, CALL REQUEST_AGENT_CHATS(agent) 
//   res.forEach((agent) => {
//     // console.log("AGENT: ", agent);
//     agent_chats(agent);
//   })

// })




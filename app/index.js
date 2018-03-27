require('dotenv').config();
const rp = require("request-promise");
const _ = require('lodash');

// returns array of logins (cs agent emails)
function request_livechat_agents() {
  let logins = [];
  let options = {
    uri: "https://api.livechatinc.com/v2/agents",
    json: true
  }
  return rp(options)
  .auth(process.env.EMAIL, process.env.API_KEY)
  .then((res) => {
    // build logins array if agent is part of group 1 
    res.forEach((agent) => {
      if (is_cs_agent(agent.group_ids, 1) === true) {
        logins.push(agent.login);
      }
    })
    return logins;
  })
}

request_livechat_agents()
.then((res) => {
  console.log("Logins: ", res);

  // FOR EACH AGENT, CALL REQUEST_AGENT_CHATS(agent) 
  res.forEach((agent) => {
    // request_agent_chats(agent);
  })


})
.catch((err) => {
  console.log("Error fetching agents: ", err);
})

function is_cs_agent(arr_group_numbers, cs_group_number) {
  if (arr_group_numbers.includes(cs_group_number)) {
    return true;          
  } else {
    return false;          
  }
}

// Then, pull report for each agent
// Docs - https://docs.livechatinc.com/rest-api/#get-list-of-chats
// Example - https://api.livechatinc.com/v2/chats?date_from=2018-01-22&date_to=2018-01-22&timezone=America/Los_Angeles&page=...
let allAgents = {};
let chat_model = ["id", "tickets", "visitor_name", "visitor_id", "agents", "rate", "duration", "chat_start_url", "referrer", "group", "started", "tags", "pre_chat_survey", "engagement", "ended", "prechat_survey"];
  
function grab_agent(agent) {
  allAgents[agent] = [];
  let chat_params = {
    date_from: "2018-01-22",
    date_to: "2018-01-25",
    timezone: "America/Los_Angeles",
    agent: agent
  }
  let chat_options = {
    uri: "https://api.livechatinc.com/v2/chats",
    json: true,
    qs: chat_params
  }
  request_agent_chats(chat_options);
}

var agents = ['bhaas@classy.org'];

grab_agent('bhaas@classy.org');

function request_agent_chats(chat_options) {
  chat_options.qs.page = chat_options.qs.page || 1;
  let agent_chats = allAgents[chat_options.qs.agent];
  rp(chat_options)
  .auth(process.env.EMAIL, process.env.API_KEY)
  .then((res) => {
    console.log("page: ", chat_options.qs.page);
    // push to total_chats only columns that we need 
    res.chats.forEach((chat) => {
      let filtered_chat = _.pick(chat, chat_model);
      agent_chats.push(filtered_chat);
    })
    // collect responses from page 2 - last page 
    if (chat_options.qs.page < res.pages) {
      chat_options.qs = _.merge(chat_options.qs, {"page":(chat_options.qs.page + 1)});
      setTimeout(next_request, 1500);
      function next_request() {
        return request_agent_chats(chat_options);
      }
    } else {
      console.log("total_chats length: ", agent_chats.length);
      console.log("```````````");
      // print to convert to CSV
      // console.log(JSON.stringify(agent_chats));
      return agent_chats;
    }
  })
  .catch((err) => {
    console.log("Error: ", err)
  })
};




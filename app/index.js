require('dotenv').config();
const rp = require("request-promise");
const _ = require('lodash');

// First, retreive list of all agents in group 1
// Docs - https://docs.livechatinc.com/rest-api/#get-list-of-chats

// let agents = [];
// let agent_options = {
//   uri: "https://api.livechatinc.com/v2/agents",
//   json: true
// }

// function livechat_agents(agent_options) {
//   rp(agent_options)
//   .auth(process.env.EMAIL, process.env.API_KEY)
//   .then((res) => {
//     console.log("Response: ", res);
//   })
// }

// livechat_agents(agent_options);

// Then, pull report for each agent
// Docs - https://docs.livechatinc.com/rest-api/#get-list-of-chats
// Example - https://api.livechatinc.com/v2/chats?date_from=2018-01-22&date_to=2018-01-22&timezone=America/Los_Angeles&page=...
let total_chats = [];
let chat_model = ["id", "tickets", "visitor_name", "visitor_id", "agents", "rate", "duration", "chat_start_url", "referrer", "group", "started", "tags", "pre_chat_survey", "engagement", "ended", "prechat_survey"];
let chat_params = {
  date_from: "2018-01-22",
  date_to: "2018-01-22",
  timezone: "America/Los_Angeles"
}
let chat_options = {
  uri: "https://api.livechatinc.com/v2/chats",
  json: true,
  qs: chat_params
}

request_agent_chats(chat_options);

function request_agent_chats(chat_options) {
  chat_params.page = chat_params.page || 1;
  rp(chat_options)
  .auth(process.env.EMAIL, process.env.API_KEY)
  .then((res) => {
    console.log("page: ", chat_params.page);
    // push to total_chats only columns that we need 
    res.chats.forEach((chat) => {
      let filtered_chat = _.pick(chat, chat_model);
      total_chats.push(filtered_chat);
    })
    // collect responses from page 2 - last page 
    if (chat_params.page < res.pages) {
      chat_params = _.merge(chat_params, {"page":(chat_params.page + 1)});
      setTimeout(next_request, 1500);
      function next_request() {
        return request_agent_chats(chat_options);
      }
    } else {
      console.log("total_chats length: ", total_chats.length);
      console.log("```````````");
      // print to convert to CSV
      console.log(JSON.stringify(total_chats));
      return total_chats;
    }
  })
  .catch((err) => {
    console.log("Error: ", err)
  })
};








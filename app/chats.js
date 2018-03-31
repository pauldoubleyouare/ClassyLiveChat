const rp = require("request-promise");
const _ = require('lodash');

// Docs - https://docs.livechatinc.com/rest-api/#get-list-of-chats
function request_agent_chats(options, agent_chats_data) {
  agent_chats_data = agent_chats_data;
  options.qs.page = options.qs.page || 1;
  return rp(options)
  .auth(process.env.EMAIL, process.env.API_KEY)
  .then((res) => {
    // push chats to agent_chats_data with only data/columns that we need
    res.chats.forEach((chat) => {
      let filtered_chat = _.pick(chat, chat_model);
      agent_chats_data.push(filtered_chat);
    })
    
    console.log("page: ", options.qs.page);
    console.log("total pages: ", res.pages);

    // collect responses from page 2 onward (livechat provides 25 chats per page)
    if (options.qs.page < res.pages) {
      options.qs = _.merge(options.qs, {"page":(options.qs.page + 1)});
      setTimeout(next_request, 1500);
      function next_request() {
        return request_agent_chats(options);
      }
    } else {
      console.log("get here");
      console.log("AGENT CHATS: ", agent_chats_data);
      // console.log("\n\n\nAgent: ", options.qs.agent);
      // console.log("Total chats: ", agent_chats_data.length);

      return Promise.resolve(agent_chats_data);
    }
  })
  .catch((err) => {
    return Promise.reject('Error: ', err)
  })
};

// returns a promise with a value of all chats for a specific agent
exports.agent_chats = function(agent) {
  let agent_chats_data = [];
  let chat_params = {
    date_from: "2018-02-01",
    date_to: "2018-02-28",
    timezone: "America/Los_Angeles",
    agent: agent
  }
  let options = {
    uri: "https://api.livechatinc.com/v2/chats",
    json: true,
    qs: chat_params
  }
  return request_agent_chats(options, agent_chats_data)
  .then(res => {
    // agent_chats_data returned from request_agent_chats
    return Promise.resolve(res);
  }) 
}

let chat_model = ["id", "tickets", "visitor_name", "visitor_id", "agents", "rate", "duration", "chat_start_url", "referrer", "group", "started", "tags", "pre_chat_survey", "engagement", "ended", "prechat_survey"];
const rp = require("request-promise");
const _ = require('lodash');

/* 
  Docs - https://docs.livechatinc.com/rest-api/#get-list-of-chats
  agent_chats returns an array of a single agent's chats
*/

exports.agent_chats = function(agent) {
  let single_agent_chats_array = [];
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
  // hit livechat API 
  return request_agent_chats(options, single_agent_chats_array)
  .then(res => {
    // single_agent_chats_array returned from request_agent_chats
    return Promise.resolve(res);
  }) 
}

function request_agent_chats(options, single_agent_chats_array) {
  single_agent_chats_array = single_agent_chats_array;
  options.qs.page = options.qs.page || 1;
  return rp(options)
  .auth(process.env.EMAIL, process.env.API_KEY)
  .then((res) => {
    // push chats to single_agent_chats_array
    res.chats.forEach((chat) => {
      let filtered_chat = _.pick(chat, chat_model);
      single_agent_chats_array.push(filtered_chat);
    })
    
    console.log("page: ", options.qs.page);
    console.log("total pages: ", res.pages);
    console.log("single_agent_chats_array length: ", single_agent_chats_array.length);

    // collect responses from page 2 onward (livechat provides 25 chats per page)
    if (options.qs.page < res.pages) {
      options.qs = _.merge(options.qs, {"page":(options.qs.page + 1)});
      setTimeout(next_request, 1500);
      function next_request() {
        return request_agent_chats(options, single_agent_chats_array);
      }
    } else {
      console.log("\n\n\n\n before index.js, does this print all of an agent's chats..");
      console.log("Agent: ", options.qs.agent);
      console.log("Total chats: ", single_agent_chats_array.length);
      return Promise.resolve(single_agent_chats_array);
    }
  })
  .catch((err) => {
    return Promise.reject('Error: ', err)
  })
};

let chat_model = ["id", "tickets", "visitor_name", "visitor_id", "agents", "rate", "duration", "chat_start_url", "referrer", "group", "started", "tags", "pre_chat_survey", "engagement", "ended", "prechat_survey"];
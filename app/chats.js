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
  return request_agent_chats(options, single_agent_chats_array)
  .then(res => {
    // return array of all chats for a single agent
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

    // collect responses from page 2 onward (livechat provides 25 chats per page)
    if (options.qs.page < res.pages) {
      return new Promise(resolve => {
        setTimeout(() => {
          options.qs = _.merge(options.qs, {"page":(options.qs.page + 1)});
          resolve(request_agent_chats(options, single_agent_chats_array)); // resolves with promise returned by request_agent_chats
        }, 1500)
      })
    } else {
      return single_agent_chats_array;
    }
  })
  .catch((err) => {
    return Promise.reject('Error: ', err)
  })
};

let chat_model = ["id", "tickets", "visitor_name", "visitor_id", "agents", "rate", "duration", "chat_start_url", "referrer", "group", "started", "tags", "pre_chat_survey", "engagement", "ended", "prechat_survey"];
require('dotenv').config();
const rp = require("request-promise");
const _ = require('lodash');

let total_chats = [];
let model = ["id", "tickets", "visitor_name", "visitor_id", "agents", "rate", "duration", "chat_start_url", "referrer", "group", "started", "tags", "pre_chat_survey", "engagement", "ended", "prechat_survey"];
let params = {
  date_from: "2018-01-22",
  date_to: "2018-01-22",
  timezone: "America/Los_Angeles"
}
let options = {
  uri: "https://api.livechatinc.com/v2/chats",
  json: true,
  qs: params
}

// https://api.livechatinc.com/v2/chats?date_from=2018-01-22&date_to=2018-01-22&timezone=America/Los_Angeles&page=...

livechat_request(options);

function livechat_request(options) {
  params.page = params.page || 1;
  console.log("page: ", params.page);
  rp(options)
  .auth(process.env.EMAIL, process.env.API_KEY)
  .then((res) => {
    // push to total_chats only columns that we need 
    res.chats.forEach((chat) => {
      let filtered_chat = _.pick(chat, model);
      total_chats.push(filtered_chat);
    })
    // collect responses from page 2 - last page 
    if (params.page < res.pages) {
      params = _.merge(params, {"page":(params.page + 1)});
      setTimeout(next_request, 1500);
      function next_request() {
        return livechat_request(options);
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








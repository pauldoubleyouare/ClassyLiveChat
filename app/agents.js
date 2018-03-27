const rp = require("request-promise");

// returns an array of agent logins (emails)
exports.request_livechat_agents = function() {
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

function is_cs_agent(arr_group_numbers, cs_group_number) {
  if (arr_group_numbers.includes(cs_group_number)) {
    return true;          
  } else {
    return false;          
  }
}

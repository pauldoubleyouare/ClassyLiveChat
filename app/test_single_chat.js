require('dotenv').config();
const rp = require("request-promise");
const _ = require('lodash');


let options = {
  uri: "https://api.livechatinc.com/chats/OXH2641EU8",
  headers: {
    "X-API-VERSION": "2"
  }
};

rp(options)
.auth(process.env.EMAIL, process.env.API_KEY)
.then((res) => {
  console.log("response: ", res);
  
})
.catch((err) => {
  console.log("Error: ", err)
})









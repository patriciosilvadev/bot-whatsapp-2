const venom = require('./src/connect');
const {connect} = venom;
const { isEmpty, split } = require("lodash");
const {Viewers}  = require("./src/model");
const venom_bot = require('venom-bot');
var CronJob = require('cron').CronJob;
var http = require('./src/http');
const configs = require('./global-config');
const { response } = require('express');


void async function() {
  var user = await afterusers()
  for(var cont = 0 ; cont <= user.length ;cont++)
  {
      connect(user[cont].cliente).then((client) => {start(client)})
        .catch((erro) => {
        console.log(erro);
      });
  } 
}()

//loop para verificar mudanças no banco de dados
var job = new CronJob('*/5 * * * * *', async function() {
  var nowuser = await nowusers()
  var afteruser = await afterusers()
  if(afteruser.status !== 400)
  {
    if(afteruser.length > nowuser.length)
    {
      // foi deletado um user do banco
      console.log('afte > now')
    }
    if(afteruser.length < nowuser.length)
    {   
      console.log('afte < now')
        // foi add um user no banco 
      for(var cont = 0 ; cont <= nowuser.length -1 ;cont++)
      {
        if(isEmpty(afteruser[cont]))
        {
          await Viewers.UpdateAfterUsers(nowuser[cont]);
          connect(nowuser[cont].cliente)
            .then((client) => {start(client)})
            .catch((erro) => {
              console.log(erro);
            });
        }
      }
    }
  }else
  {
    for(var cont = 0 ; cont <= nowuser.length -1 ;cont++)
    {
      await Viewers.UpdateAfterUsers(nowuser[cont])
      connect(nowuser[cont].cliente)
      .then((client) => {start(client)})
      .catch((erro) => {
        console.log(erro);
      });
      
    }
  }
}, null, true, 'America/Sao_Paulo');
job.start();


//loop a cada uma hora para verificar conexoes
var jobH = new CronJob('* 0 * * * *', async function() {

  var afteruser = await afterusers()
  for(var cont = 0 ; cont <= afteruser.length -1 ;cont++)
  {
    
    connect(afteruser[cont].cliente)
    .then((client) => {start(client)})
    .catch((erro) => {
      console.log(erro);
    });
  }
}, null, true, 'America/Sao_Paulo');
jobH.start();

//funcao require do banco
async function nowusers()
{
  var users = await Viewers.SelectUser()
  return users
}
async function afterusers()
{
  var users = await Viewers.selectAfterUsers()
  return users
}


//funcao para escutar e enviar mensagens
async function start(client) {
  //console.log(client)
  client.onMessage(async (message) => {
    if(message.to)
    {
      
      const phoneUser = split(message.to,'@')
      const users = await Viewers.UserSelectResponse(phoneUser[0])
      const responses = await Viewers.VerifyResponses(users[0])
      
      for(var cont = 0; cont <= responses.length-1; cont++)
      {
        
        if (message.body === responses[cont].msg && message.isGroupMsg === false) 
        {
          
          switch (responses[cont].responseType)
          {
            case 'Text':
              client.sendText(message.from, responses[cont].responseText)
              .then((result) => {
                //console.log('Result: ', result); //return object success
              })
              .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
              });
              break;
           /* case 'img':
              client.sendImage(
                message.from,
                `${responses[cont].responseImg}`,
                `${responses[cont].responseImg}`,
                'teste de imagem'
              )
              .then((result) => {
               // console.log('Result: ', result); //return object success
              })
              .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
              });
              break;
            case 'video':
            case 'audio':
            case 'file':*/
          }
        }
      }
    
    }
  });
}

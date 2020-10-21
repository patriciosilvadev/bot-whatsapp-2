const express = require('express')
const app = express()
const configs = require('../global-config')
const port = configs.http_port
const bcrypt = require('bcrypt')
const {Viewers} = require('./model')
const bodyParse = require('body-parser')
const jwt = require('jsonwebtoken')
const authConf = require('./config/auth.json')
const cors = require('cors');

app.use(cors())
app.use(express.static('public'));
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:false}));

app.post('/register', async (req, res) => {
  try
  {
    var verify = await Viewers.VerifyUser(req.body);
    if(verify.msg == 'Ok'){
      verify = await Viewers.VerifyPhone(req.body);
      if(verify.msg == 'Ok'){
        var hash = await bcrypt.hash(req.body.password,10);
        req.body.password = hash;
        var crypt = req.body
        var obj = await Viewers.createNowUsers(crypt);
        var newVerify = await Viewers.VerifyUser(req.body);
        let id = newVerify[0].id
        obj.payload.password = undefined;
        return res.send({ obj, token: generateToken({id: id}) });
      }else{
        return res.send({phone: "exist"});
      }
    }
    else{
      return res.send({user: "exist"});
    }
    
  }catch(err)
  {
    return res.status(400).send({error: 'Resgirter fail' })
  }
})

app.post('/login', async (req, res) => {
  
  try
  {
    var verify = await Viewers.VerifyUser(req.body);
    
    if(!verify.msg){
      let { password } = req.body
      let id = verify[0].id
      let keyBd = verify[0].password
     if(!await bcrypt.compare(password, keyBd))
     {
        return res.send({password: "Invalid"});
     }else
     {
       verify[0].password = undefined;
      return res.send({ 
        verify,
        token: generateToken({id: id})
      });
     }
    }
    else{
      return res.send({user: "not"});
    }
        
  }catch(err)
  {
    return res.status(400).send({error: 'Login fail' })
  }
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./projectController')(app);

function generateToken(params={})
{
  const token = jwt.sign(params,authConf.secret, { expiresIn: 86400 })
  return token;
}
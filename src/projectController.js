const express = require('express');
const authMiddlewares = require('./authMiddlewares');
const {Viewers} = require('./model')


const router = express.Router();
router.use(authMiddlewares);

router.get('/', async (req,res) => {
    const responses = await Viewers.VerifyResponses(req.query)
    var responsesVerify = [];
    for(var cont = 0 ; cont<= responses.length-1 ; cont++)
    {
        switch(responses[cont].responseType){
            case "Text":
                responsesVerify = [...responsesVerify,{
                    id: responses[cont].id,
                    idUser: responses[cont].idUser,
                    responseType: responses[cont].responseType,
                    msg: responses[cont].msg,
                    response: responses[cont].responseText,
                }]
                break;
            case "img":
                responsesVerify= [...responsesVerify,{
                    id: responses[cont].id,
                    idUser: responses[cont].idUser,
                    responseType: responses[cont].responseType,
                    msg: responses[cont].msg,
                    response: responses[cont].responseImg,
                }]
                break;
            case "video":
            responsesVerify= [...responsesVerify,{
                id: responses[cont].id,
                idUser: responses[cont].idUser,
                responseType: responses[cont].responseType,
                msg: responses[cont].msg,
                response: responses[cont].responseVideo,
            }]
            break;
            case "file":
            responsesVerify= [...responsesVerify,{
                id: responses[cont].id,
                idUser: responses[cont].idUser,
                responseType: responses[cont].responseType,
                msg: responses[cont].msg,
                response: responses[cont].responseFile,
            }]
            break;
        }
    }
    return res.send({ ok: true, UserId: req.UserId, responses: responsesVerify});
})

router.post('/newResponse', async (req,res) => {
    var body = req.body;
    const require = await Viewers.CreateNewResponses(body)
    return res.send({ ok: true, body: body, require: require})
})

router.post('/deleteResponse', async (req,res) => {
    const require = await Viewers.DeleteResponses(req.body)
    if(require)
    {
        if(require.msg == "OK")
        {
            return res.send({ ok: true, result: require });
        }else
        {
            if(require.msg == "Ops...")
            {
                return res.send({ msg: "Ops...", status: 400});
            }
            if(require.msg == "NÃO INCLUÍDO")
            {
                return res.send({ msg: "NÃO INCLUÍDO", status: 400});
            }
        }
    }else
    {
        res.send({ ok: false, result: require });
    }
})

router.post('/status', async (req,res) => {
    const require = await Viewers.statusVerify(req.body)
    if(require)
    {
        if(require.msg == "OK")
        {
            require.result.result[0].password = undefined;
            return res.send({ ok: true, result: require });
        }else
        {
            if(require.msg == "Ops...")
            {
                return res.send({ msg: "Ops...", status: 400});
            }
            if(require.msg == "NÃO INCLUÍDO")
            {
                return res.send({ msg: "NÃO INCLUÍDO", status: 400});
            }
        }
    }else
    {
        res.send({ ok: false, result: require });
    }
})

module.exports = app => app.use('/project', router);
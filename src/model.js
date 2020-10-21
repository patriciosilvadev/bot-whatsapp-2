const queries = require('./queries')
const db = require('./db')
const { execute } = db

exports.Viewers = {

    async createAfterUsers (payload) {
        const data = {}
        data.cliente = payload.cliente
        if (data.cliente) {
           
            const sql = queries.query.insertAfterUsers(data)
            const result = await execute(sql)
            
        
            if (!result || !result.rows) {
                

                return { msg: "Ops...", status: 400, data }
            
            }
            

            return { msg: "OK", status: 201, data }
        }
        
        return { msg: "NÃO INCLUÍDO", status: 400, data }
    },

    async createNowUsers (payload) {
        
            if (payload) {
                
                const sql = queries.query.CreateNewUsers(payload)
                //console.log(sql);
                const result = await execute(sql)
                
                if (!result || !result.rows) {
                    
                   return { msg: "Ops...", status: 400, payload }
              
                }
                
                return { msg: "OK", status: 201, payload }
            }
            
            return { msg: "NÃO INCLUÍDO", status: 400, data }
    },

    async SelectUser () {
        
        const sql = queries.query.selectUsers()
        const result = await execute(sql)

        if (result.rows == '') {
            
            return { msg: "Ops...", status: 400 }
        }
        
        return (result.rows); 
        
    },

    async selectAfterUsers () {
        
        const sql = queries.query.selectAfterUsers()
        const result = await execute(sql)

        if (result.rows == '') {
            return { msg: "Ops...", status: 400 }
        }
        
        return (result.rows); 
        
    },

    async VerifyUser(payload) {
        
        const sql = queries.query.VerifyUser(payload)
        const result = await execute(sql)

        if (result.rows == '') {
            
            return { msg: "Ok", status: 200, payload }
        }else
        {
            return (result.rows); 
        }
    },

    async VerifyPhone(payload) {
        
        const sql = queries.query.VerifyPhone(payload)
        const result = await execute(sql)

        if (result.rows == '') {
            
            return { msg: "Ok", status: 200, payload }
        }else
        {
            return { msg: "Exist", status: 400}; 
        }
    },

    async UpdateAfterUsers (payload) {
        
        const user = queries.query.UpdateAfterUsers(payload)
        const result = await execute(user)
        if (!result || !result.rows) {
            return { msg: "Ops...", status: 400, Usuarios: result }
        }

        return { msg: "OK", status: 200, Usuarios: result.rows }
    },

    async VerifyResponses(payload) {
        
        const sql = queries.query.VerifyResponses(payload)
        const result = await execute(sql)

        if (result.rows == '') {
            return { msg: "Don't responses", status: 400, payload }
        }else
        {
            return (result.rows); 
        }
    },
    
    async CreateNewResponses(payload) {
        
        if (payload) {
            
            const sql = queries.query.CreateNewResponses(payload)
            //console.log(sql);
            const result = await execute(sql)
            
            if (!result || !result.rows) {
                
               return { msg: "Ops...", status: 400, payload }
          
            }
            
            return { msg: "OK", status: 201, payload }
        }
        
        return { msg: "NÃO INCLUÍDO", status: 400, payload }
    },

    async DeleteResponses(payload) {
        
        if (payload) {
            
            const sql = queries.query.DeleteResponses(payload)
            //console.log(sql);
            const result = await execute(sql)
            
            if (!result || !result.rows) {
               return { msg: "Ops...", status: 400, payload }
            }
            return { msg: "OK", status: 201, payload }
        }
        return { msg: "NÃO INCLUÍDO", status: 400, payload }
    },  

    async UserSelectResponse(payload) {
        
        const sql = queries.query.UserSelectResponse(payload)
        const result = await execute(sql)

        if (result.rows == '') {
            
            return { msg: "Error", status: 400, payload }
        }else
        {
            return (result.rows); 
        }
    },

    async statusVerify(payload){
        const sql = queries.query.statusVerify(payload)
        const result = await execute(sql)

        if (result.rows == '') {
            
            return { msg: "Error", status: 400, payload }
        }else
        {
            return (result.rows); 
        }
    }
}



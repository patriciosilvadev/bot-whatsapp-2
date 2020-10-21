const mysql = require('mysql2');
const configs = require('../global-config')

const pool = mysql.createPool({
    host: configs.mysql_host,
    port: configs.mysql_port,
    user: configs.mysql_user,
    database: configs.mysql_database,
    password: configs.mysql_password,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
    charset: configs.mysql_charset
});

const COLUMN_TYPE = [
    { name: "INT", type: 3 },
    { name: "DATETIME", type: 12 },
    { name: "DATE", type: 10 },
    { name: "VARCHAR", type: 253 },
    { name: "DECIMAL", type: 246 },
]

function getColumnTypeName (columnType) {
    return COLUMN_TYPE.filter(c => c.type === columnType).map(c => c.name)[0] || columnType
}

async function execute (cmd) {

    let sql = ''
    let params = []

    if (typeof (cmd) === 'string') {

        sql = cmd

    }
    else {

        sql = cmd.query

        if (cmd.params) {

            if (Array.isArray(cmd.params)) params = [...cmd.params]
            else params = Object.values(cmd.params) || []
        }
    }

    if (sql) {

        try {

            const promisePool = pool.promise()
            const result = await promisePool.execute(sql, params)

            if (Array.isArray(result) && result.length) {

                if (result.length >= 2 && result[1]) {

                    const columns = result[1].map(c => {
                        return {
                            schema: c.schema,
                            table: c.orgTable,
                            tableAlias: c.table,
                            column: c.orgName,
                            columnAlias: c.name,
                            decimals: c.decimals,
                            columnType: getColumnTypeName(c.columnType),
                            columnLength: c.columnLength,
                            encoding: c.encoding,
                            characterSet: c.characterSet,
                        }
                    })

                    return { rows: result[0] || [], columns: columns || [], params: params || [], query: sql }
                }

                return { rows: result[0] || [], columns: [], params: params || [], query: sql }
            }

            return { rows: [], columns: [], params: params || [], query: sql, result: result }

        } catch (error) {

            console.log(error)
            if (params) console.log(params)
            if (sql) console.log(sql)
            throw error

        }
    }
}

module.exports = {
    execute
}
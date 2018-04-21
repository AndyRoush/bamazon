var mysql = require("mysql")
var inq = require("inquirer")
var cTable = require('console.table')

var config = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bamazon_db",
    port: 3306
})

var prompt = inq.createPromptModule()

var qsExec = [{
    type: "list",
    name: "superviser",
    message: "What would you like to do?",
    choices: ["View Product Sales By Department", "Create New Department"]
}]

var qsAddDept = [
    {
        type: "input",
        name: "department",
        message: "What Department would you like to add?"
    },
    {
        type: "input",
        name: "overhead",
        message: "What is the overhead cost?"
    }]

prompt(qsExec).then(function (r) {
    switch (r.superviser) {
        case 'View Product Sales By Department':
            ViewProductSalesByDepartment()
            break
        case 'Create New Department':
            CreateDepartment()
            break
    }
})

//Connecting to the mysql
config.connect(function (e) {
    if (e) throw e
})

function ViewProductSalesByDepartment() {
    query = `
    SELECT * FROM departments;
    `
    config.query(query, function (e, r) {
        if (e) throw e
        console.log("========= Product Sales by Department =========")
        console.table(r)
        config.end()
    })
}

function CreateDepartment() {
    prompt(qsAddDept).then(function (newDept) {

        var newData2 = {
            department_name: newDept.department,
            over_head_costs: newDept.overhead,
        }

        updateDept = 'INSERT INTO departments SET ?'
        config.query(updateDept, newData2, function (e, r) {
            if (e) throw e
        })
        console.log("You added " + newDept.department + " to the list of Bamazon departments!")
        config.end()
    })

}
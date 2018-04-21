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
var qs = [{
    type: "input",
    name: "itemID",
    message: "What item do you you want to purchase? (insert ID)"
},
{
    type: "input",
    name: "quantity",
    message: "How many would you like to buy?"
}]

var query = `
SELECT * FROM products;
`

//connecting to mysql
config.connect(function (e) {
    if (e) throw e
})

//Show Inventory
userPurchase()

function userPurchase() {
    config.query(query, function (e, r) {
        if (e) throw e

        console.log("==================== Bamazon Items ===================")
        console.table(r)

        prompt(qs).then(function (user) {
            var existItem
            var stock_quantity = parseInt(stock_quantity)
            existItem = false

            for (var i = 0; i < r.length; i++) {
                if (parseInt(r[i].id) === parseInt(user.itemID)) {
                    existItem = true
                }
            }

            if (!existItem) {
                console.log("=============================")
                console.log("ID is incorrect. Please try again.")
                console.log("=============================")
                userPurchase()

            } else if (r[user.itemID - 1].stock_quantity <= user.quantity) {
                console.log("=============================")
                console.log("Insufficient Quantity! Please try again.")
                console.log("=============================")
                userPurchase()

            } else if (r[user.itemID - 1].stock_quantity >= user.quantity) {
                updateStock = 'UPDATE products SET stock_quantity =' + (r[user.itemID - 1].stock_quantity - user.quantity) + ' WHERE id = ' + (user.itemID)
                config.query(updateStock, function (e, r) {
                    if (e) throw e
                    console.log("Enjoy your purchase!")
                    config.end()
                })
            }
        })
    })
}
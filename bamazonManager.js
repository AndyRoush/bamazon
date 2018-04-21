var mysql = require("mysql")
var inq = require("inquirer")
var config = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bamazon_db",
    port: 3306
})

config.connect(function (e) {
    if (e) throw e
})

var prompt = inq.createPromptModule()
var qs = [{
    type: "list",
    name: "supply",
    message: "What would you like to do?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
}]

var qsAddInv = [{
    type: "input",
    name: "itemID",
    message: "What item do you you want to add inventory to? (insert ID)"
},
{
    type: "input",
    name: "quantity",
    message: "How much inventory are you adding?"

}]

var qsAddProd = [{
    type: "input",
    name: "product",
    message: "What product are you adding?"
},
{
    type: "input",
    name: "department",
    message: "Which department is this product added to?"
},
{
    type: "input",
    name: "price",
    message: "How much is this product sold for?"
},
{
    type: "input",
    name: "inventory",
    message: "What is the product's initial inventory?"
}]

prompt(qs).then(function (r) {
    switch (r.supply) {
        case 'View Products for Sale':
            ViewCurrInventory()
            break
        case 'View Low Inventory':
            ViewLowInventory()
            break
        case 'Add to Inventory':
            AddInventory()
            break
        case 'Add New Product':
            AddProduct()
    }
})

var query = `
SELECT * FROM products;
`
function ViewCurrInventory() {
    config.query(query, function (e, r) {
        if (e) throw e

        console.log("========================== Bamazon Items ==============================")
        for (var key in r) {
            let k = r[key]
            console.log("ID " + k.id + " : " + k.product_name + " | Department: " + k.department_name + " | Price: $" + k.price + " | Inventory: " + k.stock_quantity)
        }
        console.log("=======================================================================")
    })
    config.end()
}

function ViewLowInventory() {
    var query2 = `
    SELECT * FROM products
    WHERE stock_quantity < 5;
    `
    config.query(query2, function (e, r) {
        if (e) throw e
        for (var key in r) {
            let k = r[key]
            console.log("ID " + k.id + " : " + k.product_name + " | Department: " + k.department_name + " | Price: $" + k.price + " | Inventory: " + k.stock_quantity)
        }
    })
    config.end()
}

function AddInventory() {
    config.query(query, function (e, r) {
        if (e) throw e
        prompt(qsAddInv).then(function (manager) {
            var stock_quantity = parseInt(stock_quantity)
            var managerQTY = parseInt(manager.quantity)
            updateInv = 'UPDATE products SET stock_quantity =' + (r[manager.itemID - 1].stock_quantity + managerQTY) + ' WHERE id = ' + (manager.itemID)
            config.query(updateInv, function (e, r) {
                if (e) throw e
            })
            console.log("You added " + manager.quantity + " " + r[manager.itemID - 1].product_name)
            config.end()
        })
    })
}

function AddProduct() {
    config.query(query, function (e, r) {
        if (e) throw e
        prompt(qsAddProd).then(function (newProd) {

            var newData = {
                product_name: newProd.product,
                department_name: newProd.department,
                price: newProd.price,
                stock_quantity: newProd.inventory
            }
            updateProd = 'INSERT INTO products SET ?'
            config.query(updateProd, newData, function (e, r) {
                if (e) throw e
            })
            console.log("You added " + newProd.product + " to the list of Bamazon Items!")
            config.end()
        })
    })
}

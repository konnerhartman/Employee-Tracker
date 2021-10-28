const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db'
});

connection.connect(err => {
    if (err) throw (err);
    console.log('Connected as ID' + connection.threadId);
    startPrompt();
});

const startPrompt = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'selected',
            message: 'What would you like to do?',
            choices: [
                'View all departments.',
                'View all roles.',
                'View all employees.',
                'Add a department.',
                'Add a role.',
                'Add an employee.',
                'Update an employee role.',
                'EXIT'
            ]
        }
    ])
    .then(answer => {
        switch (answer.selected) {
            case 'View all departments.':
                viewAllDepartments();
            break;

            case 'View all roles.':
                viewAllRoles();
            break;

            case 'View all employees.':
                viewAllEmployees();
            break;

            case 'Add a department.':
                addDepartment();
            break;

            case 'Add a role.':
                addRole();
            break;

            case 'Add an employee.':
                addEmployee();
            break;

            case 'Update an employee role.':
                updateRole();
            break;

            case 'EXIT':
                exitApp();
            break;

            default:
            break;
        };
    });
};

viewAllDepartments = () => {
    connection.query(
        `SELECT employee.first_name AS FIRST, employee.last_name AS LAST, department.name AS DEPARTMENT FROM employee 
        JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id 
        ORDER BY employee.id;`,
        (err, res) => {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
};

viewAllRoles = () => {
    connection.query(
        `SELECT employee.first_name AS FIRST, employee.last_name AS LAST, role.title AS TITLE FROM employee
        JOIN role ON employee.role_id = role.id;`,
        (err, res) => {
            if (err) throw err
            console.table(res)
            startPrompt()
        }
    )
};

viewAllEmployees = () => {
    connection.query(
        `SELECT employee.first_name AS FIRST, employee.last_name AS LAST, role.title AS TITLE, role.salary AS SALARY, department.name AS DEPARTMENT, CONCAT(e.first_name, " ", e.last_name) AS MANAGER FROM employee 
        INNER JOIN role on role.id = employee.role_id 
        INNER JOIN department on department.id = role.department_id 
        LEFT JOIN employee e on employee.manager_id = e.id;`,
        (err, res) => {
            if (err) throw err
            console.table(res)
            startPrompt()
        }
    )
};

addDepartment = () => {
    connection.query('', (err, res) => {
        if (err) throw err
        console.table(res)
        startPrompt()
    })
};

addRole = () => {
    connection.query('', (err, res) => {
        if (err) throw err
        console.table(res)
        startPrompt()
    })
};

addEmployee = () => {
    connection.query('', (err, res) => {
        if (err) throw err
        console.table(res)
        startPrompt()
    })
};

updateRole = () => {
    connection.query('', (err, res) => {
        if (err) throw err
        console.table(res)
        startPrompt()
    })
};

exitApp = () => {
    connection.end();
};
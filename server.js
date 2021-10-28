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
                'Update an employee role.'
            ]
        }
    ])
    .then(answer => {
        switch (answer.selected) {
            case 'View all departments.':
                viewAllDeps();
            break;

            case 'View all roles.':
                viewAllRoles();
            break;

            case 'View all employees.':
                viewAllEmps();
            break;

            case 'Add a department.':
                addDep();
            break;

            case 'Add a role.':
                addRole();
            break;

            case 'Add an employee.':
                addEmp();
            break;

            case 'Update an employee role.':
                updateRole();
            break;
        };
    });
};

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
        `SELECT employee.first_name AS FIRST, employee.last_name AS LAST, department.name AS DEPARTMENT 
        FROM employee 
        JOIN role ON employee.role_id = role.id 
        JOIN department ON role.department_id = department.id 
        ORDER BY employee.id;`,
        (err, res) => {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
};

viewAllRoles = () => {
    connection.query(
        `SELECT employee.first_name AS FIRST, employee.last_name AS LAST, role.title AS TITLE 
        FROM employee
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
        `SELECT employee.first_name AS FIRST,employee.last_name AS LAST, role.title AS TITLE, role.salary AS SALARY, department.name AS DEPARTMENT, CONCAT(e.first_name, " ", e.last_name) AS MANAGER 
        FROM employee 
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
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: 'Add department title.',
            validate: addDepartment => {
                if (addDepartment) {
                    return true;
                } else {
                    console.log('Please enter the department title.');
                    return false;
                }
        }
    }])
    .then(answer => {
        connection.query(
            `INSERT INTO department (name)
            VALUE (?);`, (answer.addDepartment),
            (err, res) => {
                if (err) throw err
                console.table(res)
                startPrompt()
            }
        )
    })
};

addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: 'Add job title.',
            validate: roleTitle => {
                if (roleTitle) {
                    return true;
                } else {
                    console.log('Please enter the job title.');
                    return false;
                }
            },
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'Add the salary for this title.',
            validate: roleSalary => {
                if (roleSalary) {
                    return true;
                } else {
                    console.log('Please enter the salary.');
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'roleDep',
            message: 'Select the department this role belongs to.',
            choices: ''
        }
    ])
    .then(answer => {
        connection.query(
            `INSERT INTO role (title, salary, department_id)
            VALUE (?,?,?);`,
            {
                title: answer.roleTitle,
                salary: answer.roleSalary,
                department_id: answer.roleDep
            },
            (err, res) => {
                if (err) throw err
                console.table(res)
                startPrompt()
            }
        )
    })
};

addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Add the first name of employee.',
            validate: firstName => {
                if (firstName) {
                    return true;
                } else {
                    console.log('Please enter the first name of employee.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Add the last name of employee.',
            validate: lastName => {
                if (lastName) {
                    return true;
                } else {
                    console.log('Please enter the last name of employee.');
                    return false;
                }
            }
        },
        {
                type: 'list',
                name: 'managerID',
                message: 'Select the manager of this employee.',
                choices: ''
        },
        {
                type: 'list',
                name: 'roleID',
                message: 'Select the job title of this employee.',
                choices: ''
        }
    ])
    .then(answer => {
        connection.query(
            `INSERT INTO employee (first_name, last_name, manager_id, role_id)
            VALUE (?, ?, ?, ?);`,
            {
                first_name: answer.firstName,
                last_name: answer.lastName,
                manager_id: answer.managerID,
                role_id: answer.roleID
            },
            (err, res) => {
                if (err) throw err
                console.table(res)
                startPrompt()
            }
        )
    })
};

updateRole = () => {
    connection.query(
        ``,
        (err, res) => {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
};

exitApp = () => {
    connection.end();
};
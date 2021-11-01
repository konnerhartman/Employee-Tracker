const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

// Creates connection 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db'
});

// When connection is established, logs message. If fails, throws error
connection.connect(err => {
    if (err) throw (err);
    console.log('Connected as ID' + connection.threadId);
    startPrompt();
});

// Initial prompt for user direction
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
    // Once startPrompt() is answered, then swich cycles through functions and lands on selected option
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

// Selects all employees by first and last name and department and joins the roles and department onto table.
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

// Selects all employees by first and last name and joins the roles onto table.
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

// Selects all employees by first and last name, department, role, and salary and joins the roles, department, and managers onto table.
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
// Allows user to add a department
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
                    // If field is submitted blank, they will get this message and try again
                    console.log('Please enter the department title.');
                    return false;
                }
        }
    }])
    .then(answer => {
        connection.query(
            // Passing SQL command to insert a new value into the table
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
    // Creates an array of existing departments
    connection.query('SELECT * FROM department', (err, data) => {
        if (err) throw err;
        let depArray = data.map(department => {
            return {
                name: department.name,
                value: department.id
            }
        });
        // User inputs title of role and salary and selects what department new role belongs to
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
                choices: depArray
                
            }
        ])
        .then(answer => {
            // Inserts a new role with title, salary, and department
            connection.query(
                `INSERT INTO role (title, salary, department_id) VALUE ('${answer.roleTitle}', ${answer.roleSalary}, ${answer.roleDep});`, 
                (err, res) => {
                    if (err) throw err
                    console.table(res)
                    startPrompt();
                }
            )
        })
    }); 
};

addEmployee = () => {
    // Creates an array of existing roles
    connection.query('SELECT id, title FROM role', (err, data) => {
        if (err) throw err;
        let roleArray = data.map(role => {
            return {
                name: role.title,
                value: role.id
            }
        });
        // Creates an array of existing managers
        connection.query('SELECT id, first_name, last_name FROM employee WHERE manager_id IS null', (err, data) => {
            if (err) throw err;
            let manArray = data.map(employee => {
                return {
                    name: employee.first_name + ' ' + employee.last_name,
                    value: employee.id
                }
            });
            // User inputs new employee name and selects role and manager from list
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
                        name: 'roleID',
                        message: 'Select the job title of this employee.',
                        choices: roleArray
                },
                {
                    type: 'list',
                    name: 'managerID',
                    message: 'Select the manager of this employee.',
                    choices: manArray
                }
            ])
            // Inserts a new employee with first/last name, role, and manager
            .then(answer => {
                connection.query(
                    `INSERT INTO employee 
                    SET ?;`,
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
                ); 
            })
        });
    });
};

updateRole = () => {
    // Creates an array of existing employees
    connection.query('SELECT id, first_name, last_name FROM employee', (err, data) => {
        if (err) throw err;
        let empArray = data.map(employee => {
            return {
                name: employee.first_name + ' ' + employee.last_name,
                value: employee.id
            }
        });
        // Creates an array of existing roles
        connection.query('SELECT id, title FROM role', (err, data) => {
            if (err) throw err;
            let roleArray = data.map(role => {
                return {
                    name: role.title,
                    value: role.id
                }
            });
            // User selects employee and new role from list
            inquirer.prompt ([
                {
                    type: 'list',
                    name: 'nameID',
                    message: 'Select an employee to update.',
                    choices: empArray
                },
                {
                    type: 'list',
                    name: 'roleID',
                    message: 'Select the new role.',
                    choices: roleArray
                }
            ])
            // Moves employee to new role 
            .then(answer => {
                connection.query(
                    `UPDATE employee SET role_id = ${answer.roleID} WHERE id = ${answer.nameID};`,
                    (err, res) => {
                        if (err) throw err
                        console.table(res)
                        startPrompt()
                    }
                ); 
            })
        })
    }
)};

// Exits the app and says 'Goodbye!' to user!
exitApp = () => {
    console.log('Goodbye!');
    connection.end();
};
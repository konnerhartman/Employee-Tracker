-- Autopopulates tables by INSERTing VALUES.
INSERT INTO department (name)
VALUES 
('Marketing'),
('Animal Opperations'),
('Guest Services'),
('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES 
('Content Manager', 80000, 1),
('Content Specialist', 50000, 1),
('Zoologist Manager', 50000, 2),
('Zoologist', 30000, 2),
('Guest Experiences Manager', 50000, 3),
('Guest Services Associate', 20000, 3),
('HR Manager', 50000, 4),
('HR Assistant', 30000, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES 
('Sarah','Johnson', null, 1),
('Jeremy','Willis', 1, 2),
('John','Jefferies', null, 3),
('Lauren','Jacobs', 3, 4),
('Bertha','Davis', 3, 4),
('Hannah','Miller', 3, 4),
('Andy','Jones', 3, 4),
('Mike','Garcia', null, 5),
('Martin','Smith', 5, 6),
('Henry','Thompson', null, 7),
('Allen','Lee', 7, 8);
use van_escolar;

SELECT * FROM student;

SELECT 
  id,
  fullName AS Nome,
  age AS Idade,
  gender AS Genero,
  seatNumber AS Poltrona,
  active AS Ativo,
  createdAt AS "Criado em"
FROM student;

DELETE FROM student WHERE id = 1;

SELECT * FROM payment;

SELECT id, amount, status, dueDate, studentId 
FROM payment;

DELETE FROM payment WHERE id = 2;

SELECT * FROM user;

SELECT id, name, email, role, createdAt 
FROM user;

SELECT * 
FROM user
WHERE email = 'carlos@empresa.com';

DELETE FROM user 
WHERE id = 1;

SELECT * FROM route;

SELECT * FROM routestop;

SELECT * FROM attendance;













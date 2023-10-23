const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// Deny access if user is not logged in
router.use((req, res, next) => {
  if (!req.user) {
    return res.status(401).send('You must be logged in to do that.');
  }
  next();
});

// Get all students 
router.get('/', async (req, res, next) => {
  try {
    const students = await prisma.student.findMany({
      where: {
        instructorId: req.user.id,
      },
    });
    res.send(students);
  } catch (error) {
    next(error);
  }
});

// Get a student by id 
router.get('/:id', async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: {
        id: parseInt(req.params.id),
        instructorId: req.user.id,
      },
    });

    if (!student) {
      return res.status(404).send('Student not found.');
    }

    res.send(student);
  } catch (error) {
    next(error);
  }
});

// Create a new student 
router.post('/', async (req, res, next) => {
  try {
    const student = await prisma.student.create({
      data: {
        name: req.body.name,
        cohort: req.body.cohort,
        instructor: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });
    res.status(201).send(student);
  } catch (error) {
    next(error);
  }
});

// Update a student 
router.put('/:id', async (req, res, next) => {
  try {
    const student = await prisma.student.update({
      where: {
        id: parseInt(req.params.id),
        instructorId: req.user.id,
      },
      data: {
        name: req.body.name,
        cohort: req.body.cohort,
      },
    });

    if (!student) {
      return res.status(404).send('Student not found.');
    }

    res.send(student);
  } catch (error) {
    next(error);
  }
});

// Delete a student by id
router.delete('/:id', async (req, res, next) => {
  try {
    const student = await prisma.student.delete({
      where: {
        id: parseInt(req.params.id),
        instructorId: req.user.id,
      },
    });

    if (!student) {
      return res.status(404).send('Student not found.');
    }

    res.send(student);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

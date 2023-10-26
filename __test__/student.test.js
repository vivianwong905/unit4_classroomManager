const { createMockContext } = require('./context')
const { prismaMock } = require('./singleton')
const { prisma } = require()

let mockCtx
let ctx

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx
})

async function createStudent (student) {
    return await prisma.student.create({
        data: {
            studentName,
            cohort,
            instructorId: req.user.id,
        },
    })
}

async function updateStudent (student) {
    return await prisma.student.update({
        data: {
            studentName,
            cohort,
        },
    })
}

test('should create a new student', async() => {
    const student ={
        studentName: "somename",
            cohort: 7867
    }
    prismaMock.student.create.mockResolvedValue(student)

    await expect (createStudent(student)).resolves.toEqual({
        studentName: "somename",
            cohort: 7867
    })
})

test('should update a student', async() => {
    const student ={
        studentName: "somename lastname",
            cohort: 7867765
    }
    prismaMock.student.update.mockResolvedValue(student)

    await expect (updateStudent(student)).resolves.toEqual({
        studentName: "somename lastname",
            cohort: 7867765
    })
})
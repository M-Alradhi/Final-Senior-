import {
  calculateWeightedGrade,
  calculateProjectProgress,
  validateTaskWeights,
  type TaskGrade,
} from "@/lib/utils/grading"

describe("Grading System", () => {
  test("calculates weighted grade correctly", () => {
    const tasks: TaskGrade[] = [
      {
        id: "1",
        title: "Report",
        maxGrade: 10,
        grade: 8,
        weight: 40,
        status: "graded",
      },
      {
        id: "2",
        title: "Presentation",
        maxGrade: 50,
        grade: 45,
        weight: 60,
        status: "graded",
      },
    ]

    const result = calculateWeightedGrade(tasks)

    expect(result.totalGrade).toBe(86)
    expect(result.completedWeight).toBe(100)
    expect(result.remainingWeight).toBe(0)
    expect(result.isPassing).toBe(true)
  })

  test("ignores ungraded tasks in grade calculation", () => {
    const tasks: TaskGrade[] = [
      {
        id: "1",
        title: "Report",
        maxGrade: 10,
        grade: 8,
        weight: 40,
        status: "graded",
      },
      {
        id: "2",
        title: "Final Demo",
        maxGrade: 50,
        weight: 60,
        status: "pending",
      },
    ]

    const result = calculateWeightedGrade(tasks)

    expect(result.totalGrade).toBe(32)
    expect(result.completedWeight).toBe(40)
    expect(result.remainingWeight).toBe(60)
  })

  test("calculates project progress based on submitted and graded tasks", () => {
    const tasks: TaskGrade[] = [
      {
        id: "1",
        title: "Task 1",
        maxGrade: 10,
        weight: 30,
        status: "submitted",
      },
      {
        id: "2",
        title: "Task 2",
        maxGrade: 10,
        grade: 9,
        weight: 40,
        status: "graded",
      },
      {
        id: "3",
        title: "Task 3",
        maxGrade: 10,
        weight: 30,
        status: "pending",
      },
    ]

    const progress = calculateProjectProgress(tasks)

    expect(progress).toBe(70)
  })

  test("validates task weights when total is 100", () => {
    const tasks: TaskGrade[] = [
      {
        id: "1",
        title: "Report",
        maxGrade: 10,
        weight: 40,
        status: "pending",
      },
      {
        id: "2",
        title: "Demo",
        maxGrade: 10,
        weight: 60,
        status: "pending",
      },
    ]

    const result = validateTaskWeights(tasks)

    expect(result.isValid).toBe(true)
    expect(result.totalWeight).toBe(100)
  })
})
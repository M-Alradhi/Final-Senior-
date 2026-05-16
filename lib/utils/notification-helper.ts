import { createNotification, createBatchNotifications } from "@/lib/firebase/notifications"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase/config"
import { translations } from "@/lib/contexts/language-context"

const ar = (key: string) => translations.ar[key] || key
const en = (key: string) => translations.en[key] || key

export async function notifyProjectApproved(studentId: string, projectTitle: string, supervisorName: string) {
  await createNotification({
    userId: studentId,
    title: ar("projectIdeaAccepted"),
    titleEn: en("projectIdeaAccepted"),
    message: `${ar("acceptYourIdea")} "${projectTitle}" ${ar("supervisorChoosen")}${supervisorName}`,
    messageEn: `${en("acceptYourIdea")} "${projectTitle}" ${en("supervisorChoosen")}${supervisorName}`,
    type: "success",
    link: "/student/project",
    priority: "high",
    category: "project",
  })
}

export async function notifyProjectRejected(studentId: string, projectTitle: string, reason: string) {
  await createNotification({
    userId: studentId,
    title: ar("projectIdeaRejectedMsg"),
    titleEn: en("projectIdeaRejectedMsg"),
    message: `${ar("yourProjectIdeaRejected")}"${projectTitle}". ${ar("reason")}: ${reason}`,
    messageEn: `${en("yourProjectIdeaRejected")}"${projectTitle}". ${en("reason")}: ${reason}`,
    type: "error",
    link: "/student/project",
    priority: "high",
    category: "project",
  })
}

export async function notifyNewProjectIdea(coordinatorId: string, studentName: string, projectTitle: string) {
  await createNotification({
    userId: coordinatorId,
    title: ar("newProjectIdea"),
    titleEn: en("newProjectIdea"),
    message: ` ${ar("studentSubmittedNewProjectIdea")} ${studentName} ${ar("newProjectIdea")}: ${projectTitle}`,
    messageEn: ` ${en("studentSubmittedNewProjectIdea")} ${studentName} ${en("newProjectIdea")}: ${projectTitle}`,
    type: "info",
    link: "/coordinator/approve-projects",
    priority: "medium",
    category: "project",
  })
}

export async function notifyTaskAssigned(studentId: string, taskTitle: string, dueDate: Date) {
  await createNotification({
    userId: studentId,
    title: ar("newTaskAssigned"),
    titleEn: en("newTaskAssigned"),
    message: ` ${ar("newTaskAssignedTo")} ${taskTitle}.  ${ar("dueDate")}: ${dueDate.toLocaleDateString("ar-EG")}`,
    messageEn: ` ${en("newTaskAssignedTo")} ${taskTitle}.  ${en("dueDate")}: ${dueDate.toLocaleDateString("en-US")}`,
    type: "task",
    link: "/student/tasks",
    priority: "high",
    category: "task",
  })
}

export async function notifyTaskSubmitted(supervisorId: string, studentName: string, taskTitle: string) {
  await createNotification({
    userId: supervisorId,
    title: ar("newTaskSubmitted"),
    titleEn: en("newTaskSubmitted"),
    message: ` ${ar("theStudent")} ${studentName} ${ar("submittedTheTask")}: ${taskTitle}`,
    messageEn: ` ${en("theStudent")} ${studentName} ${en("submittedTheTask")}: ${taskTitle}`,
    type: "info",
    link: "/supervisor/tasks",
    priority: "medium",
    category: "task",
  })
}

export async function notifyTaskGraded(studentId: string, taskTitle: string, grade: number, maxGrade: number) {
  await createNotification({
    userId: studentId,
    title: ar("gradeUpdated"),
    titleEn: en("gradeUpdated"),
    message: `${ar("theTaskGradded")} "${taskTitle}". ${ar("grade")}: ${grade}/${maxGrade}`,
    messageEn: `${en("theTaskGradded")} "${taskTitle}". ${en("grade")}: ${grade}/${maxGrade}`,
    type: "evaluation",
    link: "/student/tasks",
    priority: "high",
    category: "task",
  })
}

export async function notifyMeetingScheduled(studentId: string, title: string, date: Date, supervisorName: string) {
  await createNotification({
    userId: studentId,
    title: ar("newMeeting"),
    titleEn: en("newMeeting"),
    message: ` ${ar("theMeetingIsScheduled")} "${title}" ${ar("with")} ${supervisorName} ${ar("in")} ${date.toLocaleString("ar-SA")}`,
    messageEn: ` ${en("theMeetingIsScheduled")} "${title}" ${en("with")} ${supervisorName} ${en("in")} ${date.toLocaleString("en-US")}`,
    type: "meeting",
    link: "/student/meetings",
    priority: "high",
    category: "meeting",
  })
}

export async function notifyMeetingCancelled(studentId: string, title: string) {
  await createNotification({
    userId: studentId,
    title: ar("theMeetingCancelled"),
    titleEn: en("theMeetingCancelled"),
    message: ` ${ar("theMeetingCancelled")}: ${title}`,
    messageEn: ` ${en("theMeetingCancelled")}: ${title}`,
    type: "warning",
    link: "/student/meetings",
    priority: "medium",
    category: "meeting",
  })
}

export async function notifyDeadlineApproaching(studentId: string, taskTitle: string, daysRemaining: number) {
  await createNotification({
    userId: studentId,
    title: ar("deadlineSoon"),
    titleEn: en("deadlineSoon"),
    message: ` ${ar("deadlineSoon")}: ${taskTitle} ${ar("after")} ${daysRemaining} ${daysRemaining === 1 ? ar("day") : ar("days")}`,
    messageEn: ` ${en("deadlineSoon")}: ${taskTitle} ${en("after")} ${daysRemaining} ${daysRemaining === 1 ? en("day") : en("days")}`,
    type: "warning",
    link: "/student/tasks",
    priority: "high",
    category: "task",
  })
}

export async function notifyNewMessage(userId: string, senderName: string, preview: string) {
  await createNotification({
    userId: userId,
    title: ` ${ar("newMessageFrom")} ${senderName}`,
    titleEn: ` ${en("newMessageFrom")} ${senderName}`,
    message: preview,
    messageEn: preview,
    type: "message",
    link: "/student/messages",
    priority: "medium",
    category: "message",
  })
}

export async function notifyProjectAssigned(supervisorId: string, projectTitle: string, studentName: string) {
  await createNotification({
    userId: supervisorId,
    title: ar("newProjectIsAssigned"),
    titleEn: en("newProjectIsAssigned"),
    message: ` ${ar("youAreSupervisorOf")} "${projectTitle}" ${ar("forStudent")} ${studentName}`,
    messageEn: ` ${en("youAreSupervisorOf")} "${projectTitle}" ${en("forStudent")} ${studentName}`,
    type: "project",
    link: "/supervisor/projects",
    priority: "high",
    category: "project",
  })
}

export async function notifyBulkTaskDeadlines(
  notifications: Array<{ studentId: string; taskTitle: string; daysRemaining: number }>,
) {
  await createBatchNotifications(
    notifications.map((n) => ({
      userId: n.studentId,
      title: ar("deadlineSoon"),
      titleEn: en("deadlineSoon"),
      message: ` ${ar("deadlineSoon")}: ${n.taskTitle} ${ar("after")} ${n.daysRemaining} ${n.daysRemaining === 1 ? ar("day") : ar("days")}`,
      messageEn: ` ${en("deadlineSoon")}: ${n.taskTitle} ${en("after")} ${n.daysRemaining} ${n.daysRemaining === 1 ? en("day") : en("days")}`,
      type: "warning",
      link: "/student/tasks",
      priority: "high",
      category: "task",
    })),
  )
}

export async function notifyCoordinators(title: string, message: string, link: string) {
  try {
    const db = getFirebaseDb()
    const coordinatorsQuery = query(collection(db, "users"), where("role", "==", "coordinator"))
    const coordinatorsSnapshot = await getDocs(coordinatorsQuery)

    const notifications = coordinatorsSnapshot.docs.map((doc) => ({
      userId: doc.id,
      title,
      message,
      type: "info" as const,
      link,
      priority: "high" as const,
      category: "project" as const,
    }))

    if (notifications.length > 0) {
      await createBatchNotifications(notifications)
      console.log(`Sent notifications to ${notifications.length} coordinators`)
    }
  } catch (error) {
    console.error("Error notifying coordinators:", error)
  }
}
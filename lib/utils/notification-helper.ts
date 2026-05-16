import { createNotification, createBatchNotifications } from "@/lib/firebase/notifications"
import { collection, query, where, getDocs } from "firebase/firestore"
import { getFirebaseDb } from "@/lib/firebase/config"
import { translations } from "@/lib/contexts/language-context"

const t = (key: string) => translations.ar[key] || key

export async function notifyProjectApproved(studentId: string, projectTitle: string, supervisorName: string) {
  await createNotification({
    userId: studentId,
    title: t("projectIdeaAccepted"),
    message: `${t("acceptYourIdea")} "${projectTitle}" ${t("supervisorChoosen")}${supervisorName}`,
    type: "success",
    link: "/student/project",
    priority: "high",
    category: "project",
  })
}

export async function notifyProjectRejected(studentId: string, projectTitle: string, reason: string) {
  await createNotification({
    userId: studentId,
    title: t("projectIdeaRejectedMsg"),
    message: `${t("yourProjectIdeaRejected")}"${projectTitle}". ${t("reason")}: ${reason}`,
    type: "error",
    link: "/student/project",
    priority: "high",
    category: "project",
  })
}

export async function notifyNewProjectIdea(coordinatorId: string, studentName: string, projectTitle: string) {
  await createNotification({
    userId: coordinatorId,
    title: t("newProjectIdea"),
    message: ` ${t("studentSubmittedNewProjectIdea")} ${studentName} ${t("newProjectIdea")}: ${projectTitle}`,
    type: "info",
    link: "/coordinator/approve-projects",
    priority: "medium",
    category: "project",
  })
}

export async function notifyTaskAssigned(studentId: string, taskTitle: string, dueDate: Date) {
  await createNotification({
    userId: studentId,
    title: t("newTaskAssigned"),
    message: ` ${t("newTaskAssignedTo")} ${taskTitle}.  ${t("dueDate")}: ${dueDate.toLocaleDateString("ar-EG")}`,
    type: "task",
    link: "/student/tasks",
    priority: "high",
    category: "task",
  })
}

export async function notifyTaskSubmitted(supervisorId: string, studentName: string, taskTitle: string) {
  await createNotification({
    userId: supervisorId,
    title: t("newTaskSubmitted"),
    message: ` ${t("theStudent")} ${studentName} ${t("submittedTheTask")}: ${taskTitle}`,
    type: "info",
    link: "/supervisor/tasks",
    priority: "medium",
    category: "task",
  })
}

export async function notifyTaskGraded(studentId: string, taskTitle: string, grade: number, maxGrade: number) {
  await createNotification({
    userId: studentId,
    title: t("gradeUpdated"),
    message: `${t("theTaskGradded")} "${taskTitle}". ${t("grade")}: ${grade}/${maxGrade}`,
    type: "evaluation",
    link: "/student/tasks",
    priority: "high",
    category: "task",
  })
}

export async function notifyMeetingScheduled(studentId: string, title: string, date: Date, supervisorName: string) {
  await createNotification({
    userId: studentId,
    title: t("newMeeting"),
    message: ` ${t("theMeetingIsScheduled")} "${title}" ${t("with")} ${supervisorName} ${t("in")} ${date.toLocaleString("ar-SA")}`,
    type: "meeting",
    link: "/student/meetings",
    priority: "high",
    category: "meeting",
  })
}

export async function notifyMeetingCancelled(studentId: string, title: string) {
  await createNotification({
    userId: studentId,
    title: t("theMeetingCancelled"),
    message: ` ${t("theMeetingCancelled")}: ${title}`,
    type: "warning",
    link: "/student/meetings",
    priority: "medium",
    category: "meeting",
  })
}

export async function notifyDeadlineApproaching(studentId: string, taskTitle: string, daysRemaining: number) {
  await createNotification({
    userId: studentId,
    title: t("deadlineSoon"),
    message: ` ${t("deadlineSoon")}: ${taskTitle} ${t("after")} ${daysRemaining} ${daysRemaining === 1 ? t("day") : t("days")}`,
    type: "warning",
    link: "/student/tasks",
    priority: "high",
    category: "task",
  })
}

export async function notifyNewMessage(userId: string, senderName: string, preview: string) {
  await createNotification({
    userId: userId,
    title: ` ${t("newMessageFrom")} ${senderName}`,
    message: preview,
    type: "message",
    link: "/student/messages",
    priority: "medium",
    category: "message",
  })
}

export async function notifyProjectAssigned(supervisorId: string, projectTitle: string, studentName: string) {
  await createNotification({
    userId: supervisorId,
    title: t("newProjectIsAssigned"),
    message: ` ${t("youAreSupervisorOf")} "${projectTitle}" ${t("forStudent")} ${studentName}`,
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
      title: t("deadlineSoon"),
      message: ` ${t("deadlineSoon")}: ${n.taskTitle} ${t("after")} ${n.daysRemaining} ${n.daysRemaining === 1 ? t("day") : t("days")}`,
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

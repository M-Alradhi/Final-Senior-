import {
  isFileSafeToUpload,
  sanitizeFileName,
  formatFileSize,
  isPdfFile,
} from "@/lib/utils/file-helpers"

describe("File Upload Security", () => {
  test("allows safe PDF files", () => {
    const file = new File(["content"], "report.pdf", {
      type: "application/pdf",
    })

    const result = isFileSafeToUpload(file)

    expect(result.safe).toBe(true)
  })

  test("blocks executable files", () => {
    const file = new File(["bad"], "virus.exe", {
      type: "application/octet-stream",
    })

    const result = isFileSafeToUpload(file)

    expect(result.safe).toBe(false)
  })

  test("blocks JavaScript files", () => {
    const file = new File(["alert(1)"], "script.js", {
      type: "text/javascript",
    })

    const result = isFileSafeToUpload(file)

    expect(result.safe).toBe(false)
  })

  test("sanitizes unsafe file names", () => {
    const result = sanitizeFileName("my report<>.pdf")

    expect(result).toBe("my_report__.pdf")
  })

  test("detects PDF files", () => {
    const result = isPdfFile({
      name: "final-report.pdf",
    })

    expect(result).toBe(true)
  })

  test("formats file size correctly", () => {
    expect(formatFileSize(1024)).toBe("1.0 KB")
  })
})
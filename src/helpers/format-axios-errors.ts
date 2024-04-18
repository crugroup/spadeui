export default function formatAxiosErrors(data: { [key: string]: string[] }): string {
  let errors = "";

  if (!data) {
    return "Something went wrong. Please try again later.";
  }

  for (const [field, messages] of Object.entries(data)) {
    if (typeof messages === "string") {
      return messages;
    }

    for (const message of messages) {
      errors += `"${field}": ${message}\n`;
    }
  }

  return errors || "Please provide a valid data";
}

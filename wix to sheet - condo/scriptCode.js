function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById("1bjIgW9YmlUy_vY0Rj2LRpU1GYf1aKU2IKKqZHnLJBII"); // replace with your sheet ID
    const sheet = ss.getSheetByName("Sheet1"); // replace with your sheet name

    const data = JSON.parse(e.postData.contents);

    // Add new row
    sheet.appendRow([
      data.postalOrCity || "",
      data.membersOption || "",
      data.startDate || "",
      data.endDate || "",
      data.companyName || "",
      data.contactPerson || "",
      data.telephone || "",
      data.email || "",
      new Date() // Timestamp
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "message": error }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

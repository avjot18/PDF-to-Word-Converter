function convertToWord() {
  if (!selectedFile) {
    showMessage("Please select a PDF file.", "red");
    return;
  }

  var formData = new FormData();
  formData.append("pdfFile", selectedFile);

  fetch("/convert", {
    method: "POST",
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Conversion failed.");
      }
      return response.blob();
    })
    .then(blob => {
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "converted.docx";
      a.click();
      window.URL.revokeObjectURL(url);
      showMessage("Conversion successful.", "green");
    })
    .catch(error => {
      showMessage("An error occurred during conversion.", "red");
      console.error(error);
    });
}




function showMessage(message, color) {
  var messageElement = document.getElementById("message");
  messageElement.textContent = message;
  messageElement.style.color = color;
}

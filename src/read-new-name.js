const PDFParser = require("pdf2json");
const fs = require("fs");
const path = require("path");

/**
 *
 * @param {string} oldName
 * @param {Args} args
 * @return {string}
 */
module.exports = async function readNewName(oldName, args) {
  try {
    const pdfParsed = await loadPdfText(oldName);
    const match = args.searchPattern.exec(pdfParsed);
    if (match === null) {
      const textFile = oldName + ".parsed.txt";
      fs.writeFileSync(textFile, pdfParsed);
      throw new Error(
        `Content did not match expected RegExp. Text content searched saved to '${textFile}'.`
      );
    }

    const rawName = args.namePattern.replace(/\$(\d)/g, captureReplacer);
    const newName = rawName.replace(/[<>:"\/\\|?*]/g, "-");

    const newPath = path.join(path.dirname(oldName), newName);
    return newPath;

    function captureReplacer(substr, index) {
      return match[index];
    }
  } catch (err) {
    console.log(oldName);
    console.log("    Error reading file");
    console.log("    " + err.message.split("\n").join("\n    "));
    return null;
  }
};

function loadPdfText(file) {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser({}, false);
    parser.on("pdfParser_dataError", reject);
    parser.on("pdfParser_dataReady", (pdfData) => {
      const rawTexts = [];

      pdfData.formImage.Pages[0].Texts.forEach((text) =>
        text.R.forEach((content) => rawTexts.push(decodePdfText(content.T)))
      );

      const content = rawTexts.join(" ");
      resolve(content);
    });
    parser.loadPDF(file);
  });
}

function decodePdfText(text) {
  return text
    .replace(/%C2%A0/gi, " ")
    .replace(/%([0-9A-F][0-9A-F])/gi, decodePdfChar);
}

function decodePdfChar(encoding, hex) {
  if (!hex) {
    return "";
  }
  const c = parseInt(hex, 16);
  return String.fromCharCode(c);
}

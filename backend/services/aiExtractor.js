const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function extractCRMData(records) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const prompt = `
You are a CRM data extraction AI.

Convert these lead records into CRM format.

Rules:
- Return ONLY valid JSON array.
- Skip records without email and mobile number.
- crm_status must be only:
  GOOD_LEAD_FOLLOW_UP,
  DID_NOT_CONNECT,
  BAD_LEAD,
  SALE_DONE

- country should be India if not available.
- Use remarks/notes/comments as crm_note.
- Keep mobile numbers only as digits.
- If a field is unavailable use empty string.

CRM fields:
created_at,
name,
email,
country_code,
mobile_without_country_code,
company,
city,
state,
country,
lead_owner,
crm_status,
crm_note,
data_source,
possession_time,
description

Input records:

${JSON.stringify(records)}
`;

  const result = await model.generateContent(prompt);

  const response = result.response.text();

  const cleanJSON = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanJSON);
}

module.exports = {
  extractCRMData,
};

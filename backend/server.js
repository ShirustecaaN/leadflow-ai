const express = require("express");
const cors = require("cors");
const { extractCRMData } = require("./services/aiExtractor");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

function getValue(row, possibleKeys) {
  const foundKey = Object.keys(row).find((key) =>
    possibleKeys.some((possibleKey) =>
      key.toLowerCase().includes(possibleKey)
    )
  );

  return foundKey ? String(row[foundKey] ?? "").trim() : "";
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}
app.post("/import-leads", async (req, res) => {
  const leads = req.body;

  const importedLeads = [];
  const skippedLeads = [];

  leads.forEach((lead, index) => {
    const email = getValue(lead, ["email", "mail"]);
    const phone = getValue(lead, ["phone", "mobile", "contact"]);

    if (!email && !phone) {
  skippedLeads.push({
    rowNumber: index + 1,
    name: getValue(lead, ["name", "full_name", "customer"]) || "Unknown",
    email: email || "Not provided",
    phone: phone || "Not provided",
    reason: "Missing both email and phone number",
  });
  return;
}
let status = "New";
let warning = "";

if (email && !isValidEmail(email)) {
  status = "Needs Review";
  warning = "Invalid email format";
}

if (phone && !isValidPhone(phone)) {
  status = "Needs Review";
  warning = "Invalid phone number";
}
    
      importedLeads.push({
  id: index + 1,
  created_at: new Date().toISOString(),

  name: getValue(lead, ["name", "full_name", "customer"]) || "Unknown",

  email,

  country_code: "+91",

  mobile_without_country_code: phone,

  company:
    getValue(lead, ["company", "organization", "business"]) ||
    "",

  city:
    getValue(lead, ["city", "location"]) ||
    "",

  state:
    getValue(lead, ["state"]) ||
    "",

  country:
    getValue(lead, ["country"]) ||
    "India",

  lead_owner: "",

  crm_status: "GOOD_LEAD_FOLLOW_UP",

  crm_note:
    getValue(lead, ["notes", "remarks", "comment"]) ||
    warning,

  data_source: "",

  possession_time: "",

  description:
    getValue(lead, ["description", "details"]) ||
    "",

  status,
  warning,
});
  });

 res.json({
  imported: importedLeads.length,
  skipped: skippedLeads.length,
  importedLeads: importedLeads,
  skippedLeads: skippedLeads,
});
});

app.listen(PORT, () => {
  console.log(`LeadFlow AI backend is running on http://localhost:${PORT}`);
});

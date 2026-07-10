"use client";

import { useRef, useState } from "react";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [emailIndex, setEmailIndex] = useState<number | null>(null);
  const [phoneIndex, setPhoneIndex] = useState<number | null>(null);
  const [importStarted, setImportStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [importedLeads, setImportedLeads] = useState<any[]>([]);
  const [skippedLeads, setSkippedLeads] = useState<any[]>([]);
  function chooseFile() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      alert("Please choose a CSV file.");
      event.target.value = "";
      return;
    }

    setFileName(selectedFile.name);
    setImportStarted(false);

    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.trim().split("\n");

      const csvHeaders = lines[0]
        .replace("\r", "")
        .split(",")
        .map((header) => header.trim());

      const csvRows = lines
        .slice(1)
        .map((line) =>
          line
            .replace("\r", "")
            .split(",")
            .map((cell) => cell.trim())
        );

      const foundEmailIndex = csvHeaders.findIndex((header) => {
        const heading = header.toLowerCase();
        return heading.includes("email") || heading.includes("mail");
      });

      const foundPhoneIndex = csvHeaders.findIndex((header) => {
        const heading = header.toLowerCase();
        return (
          heading.includes("phone") ||
          heading.includes("mobile") ||
          heading.includes("contact")
        );
      });

      setHeaders(csvHeaders);
      setRows(csvRows);
      setEmailIndex(foundEmailIndex === -1 ? null : foundEmailIndex);
      setPhoneIndex(foundPhoneIndex === -1 ? null : foundPhoneIndex);
    };

    reader.readAsText(selectedFile);
  }
function getCellValue(row: string[], possibleHeaders: string[]) {
  const columnIndex = headers.findIndex((header) =>
    possibleHeaders.some((possibleHeader) =>
      header.toLowerCase().includes(possibleHeader)
    )
  );

  return columnIndex === -1 ? "" : row[columnIndex] ?? "";
}
   async function confirmImport() {
    setLoading(true);
    
    const leads = rows.map((row) => ({
  name: getCellValue(row, ["name", "full name", "customer"]),
  email: getCellValue(row, ["email", "mail"]),
  phone: getCellValue(row, ["phone", "mobile", "contact"]),
  company: getCellValue(row, ["company", "organization", "business"]),
  city: getCellValue(row, ["city", "location", "place"]),
  notes: getCellValue(row, ["remarks", "notes", "comment", "message"]),
}));

    try {
      const response = await fetch(
  "https://leadflow-ai-backend-4gp3.onrender.com/import",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ leads }),
  }
);

      const result = await response.json();

      setImportedCount(result.imported);
      setSkippedCount(result.skipped);
      setImportedLeads(result.importedLeads || []);
      setSkippedLeads(result.skippedLeads || []);
      setImportStarted(true);
      setLoading(false);
 
    } catch {
      alert("Backend is not running. Please start the backend server.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 sm:px-10">
      <section className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <p className="text-xl font-bold tracking-tight">LeadFlow AI</p>
            <p className="mt-1 text-sm text-slate-500">
              CRM import workspace
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            Secure import
          </span>
        </header>

        <div className="mt-10">
          <p className="text-sm font-semibold text-blue-700">
            STEP 1 OF 3 — UPLOAD
          </p>

          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Turn messy lead sheets into CRM-ready contacts.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Upload a CSV file to review your data before anything is imported.
            AI processing starts only after you confirm.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-8 shadow-sm sm:p-12">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              ↑
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Upload your lead file
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Choose a CSV export from Facebook, Google Ads, Excel, or any
              other lead source.
            </p>

            <button
              onClick={chooseFile}
              className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Choose CSV file
            </button>

            <p className="mt-4 text-xs text-slate-400">
              CSV files only · Your data stays private until you confirm import
            </p>
          </div>
        </div>

        {fileName && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="font-semibold text-emerald-800">File selected</p>
            <p className="mt-1 text-sm text-emerald-700">{fileName}</p>
            <p className="mt-1 text-sm text-emerald-700">
              Preview ready: {rows.length} lead rows and {headers.length} columns found.
            </p>
          </div>
        )}

        {headers.length > 0 && (
          <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Preview before import</h2>

            <p className="mt-1 text-sm text-slate-500">
              Review the original CSV data. Nothing has been processed yet.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    {headers.map((header, index) => (
                      <th
                        key={`${header}-${index}`}
                        className="whitespace-nowrap px-3 py-3 font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-slate-100">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="whitespace-nowrap px-3 py-3 text-slate-600"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
              <p className="text-sm text-slate-500">
                {rows.length} rows are ready for review.
              </p>

              <button
  onClick={confirmImport}
  disabled={loading}
  className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
>
  {loading ? "AI is processing..." : "Confirm import"}
</button>
            </div>
          </section>
        )}

        {importStarted && (
          <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="font-semibold text-blue-900">Import request received</p>

            <p className="mt-1 text-sm text-blue-800">
              LeadFlow AI found email and phone columns automatically.
            </p>

            <div className="mt-4 flex gap-3">
              <span className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-emerald-700">
                Imported: {importedCount}
              </span>

              <span className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-rose-700">
                Skipped: {skippedCount}
              </span>
            </div>
          </section>
        )}
        {importStarted && importedLeads.length > 0 && (
  <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
    <h2 className="text-lg font-semibold">Imported CRM contacts</h2>
    <p className="mt-1 text-sm text-slate-500">
      Successfully imported lead records.
    </p>

    <div className="mt-4 max-h-80 overflow-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="sticky top-0 bg-white">
          <tr className="border-b border-slate-200">
                <th className="px-3 py-3 font-semibold">Name</th>
                <th className="px-3 py-3 font-semibold">Email</th>
                <th className="px-3 py-3 font-semibold">Mobile</th>
                <th className="px-3 py-3 font-semibold">Company</th>
                <th className="px-3 py-3 font-semibold">City</th>
                <th className="px-3 py-3 font-semibold">Country</th>
                <th className="px-3 py-3 font-semibold">CRM Status</th>
                <th className="px-3 py-3 font-semibold">CRM Note</th>
          </tr>
        </thead>

        <tbody>
          {importedLeads.map((lead) => (
            <tr key={lead.id} className="border-b border-slate-100">
                    <td className="whitespace-nowrap px-3 py-3">
                       {lead.name}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3">
                       {lead.email || "—"}
                    </td>

                     <td className="whitespace-nowrap px-3 py-3">
                       {lead.mobile_without_country_code || "—"}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3">
                      {lead.company || "—"}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3">
                      {lead.city || "—"}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3">
                      {lead.country || "—"}
                    </td>

                     <td className="whitespace-nowrap px-3 py-3">
                      {lead.crm_status || "—"}
                      </td>

<td className="whitespace-nowrap px-3 py-3">
  {lead.crm_note || "—"}
</td>
                
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)}
{importStarted && skippedLeads.length > 0 && (
  <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
    <h2 className="text-lg font-semibold">Skipped Leads</h2>

    <p className="mt-1 text-sm text-slate-500">
      These records were skipped during import.
    </p>

    <div className="mt-4 max-h-80 overflow-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="sticky top-0 bg-white">
          <tr className="border-b border-slate-200">
            <th className="px-3 py-3 font-semibold">Row</th>
            <th className="px-3 py-3 font-semibold">Name</th>
            <th className="px-3 py-3 font-semibold">Email</th>
            <th className="px-3 py-3 font-semibold">Phone</th>
            <th className="px-3 py-3 font-semibold">Reason</th>
          </tr>
        </thead>

        <tbody>
          {skippedLeads.map((lead) => (
            <tr key={lead.rowNumber} className="border-b border-slate-100">
              <td className="px-3 py-3">{lead.rowNumber}</td>
              <td className="px-3 py-3">{lead.name}</td>
              <td className="px-3 py-3">{lead.email}</td>
              <td className="px-3 py-3">{lead.phone}</td>
              <td className="px-3 py-3">
                {lead.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)}


        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold">1. Upload</p>
            <p className="mt-2 text-sm text-slate-500">
              Add any valid CSV file.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold">2. Review</p>
            <p className="mt-2 text-sm text-slate-500">
              Check the original rows before import.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold">3. Import</p>
            <p className="mt-2 text-sm text-slate-500">
              Convert leads into CRM-ready records.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

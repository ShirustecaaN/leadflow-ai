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
  const [importedCount, setImportedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);

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

  function confirmImport() {
    let validRows = 0;
    let invalidRows = 0;

    rows.forEach((row) => {
      const email = emailIndex !== null ? row[emailIndex] ?? "" : "";
      const phone = phoneIndex !== null ? row[phoneIndex] ?? "" : "";

      if (email.trim() || phone.trim()) {
        validRows++;
      } else {
        invalidRows++;
      }
    });

    setImportedCount(validRows);
    setSkippedCount(invalidRows);
    setImportStarted(true);
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
                className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Confirm import
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

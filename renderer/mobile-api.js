/* Android/Capacitor implementation of the Electron API contract.
   Electron supplies window.api first, so desktop continues to use IPC. */
(() => {
  if (window.api) return;

  const UPLOADS = 'docop.mobile.uploads';
  const PACKS = 'docop.mobile.packs';
  const FILES = new Map();
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const date = value => /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) ? new Date(`${value}T12:00:00`).toISOString() : new Date().toISOString();
  const objectives = text => String(text || '').split(/\n+/).filter(line => /^\s*(?:[-*•]|\d+[.)])\s+/.test(line)).slice(0, 20).map(line => line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '').trim()).filter(Boolean);
  const loadPdfJs = async () => {
    if (window.pdfjsLib) return window.pdfjsLib;
    const pdfjs = await import('./vendor/pdf.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = './vendor/pdf.worker.mjs';
    window.pdfjsLib = pdfjs;
    return pdfjs;
  };
  const extract = async file => {
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension === 'txt' || extension === 'md') return file.text();
    if (extension === 'docx' && window.mammoth) return (await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value || '';
    if (extension === 'pdf') {
      const pdfjs = await loadPdfJs();
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await pdfjs.getDocument({ data: bytes }).promise;
      const pages = [];
      for (let i = 1; i <= doc.numPages; i += 1) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items
          .map(item => ('str' in item ? item.str : ''))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (text) pages.push(text);
      }
      return pages.join('\n\n');
    }
    throw new Error('Use PDF, DOCX, TXT, or MD files.');
  };
  const askKey = () => {
    const saved = localStorage.getItem('docop.mobile.gemini-key');
    if (saved) return saved;
    const key = window.prompt('Enter your Gemini API key. It is stored only on this phone.');
    if (key) localStorage.setItem('docop.mobile.gemini-key', key.trim());
    return key || '';
  };
  const geminiJson = async (prompt, fallback) => {
    const key = askKey();
    if (!key) return fallback();
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.3 } })
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || '{}');
    } catch (error) { console.warn('Mobile Gemini request failed', error); return fallback(); }
  };
  const geminiText = async (prompt, fallback) => {
    const key = askKey();
    if (!key) return fallback();
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4 } }) });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      return String(data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim() || fallback();
    } catch (error) { console.warn('Mobile Gemini request failed', error); return fallback(); }
  };
  const packKey = (uploadId, mode) => `${uploadId}:${mode || 'mixed'}`;
  const localPack = upload => {
    const points = objectives(upload.text);
    const topic = points[0] || upload.name.replace(/\.[^.]+$/, '');
    return { generatedWith: 'On-device document extraction', generatedAt: new Date().toISOString(), answers: {}, objectives: points.map(title => ({ title, detail: '', document: upload.name })), multipleChoice: [{ id: id(), type: 'theoretical', sourceDocument: upload.name, question: `Which statement best reflects the learning material on ${topic}?`, options: [{ label: 'A', text: topic, isCorrect: true, explanation: 'Review the uploaded document for the supporting detail.' }, { label: 'B', text: 'An unrelated concept', isCorrect: false, explanation: 'This is not drawn from the uploaded document.' }, { label: 'C', text: 'None of the document content', isCorrect: false, explanation: 'Use the document content.' }, { label: 'D', text: 'A contradictory statement', isCorrect: false, explanation: 'Check the document carefully.' }] }], longAnswer: [{ id: id(), type: 'theoretical', sourceDocument: upload.name, question: `Explain the key points about ${topic}.`, modelAnswer: points.join('\n') || 'Review the uploaded document.', documentAnswer: points.join('\n'), rubric: points.slice(0, 5) }] };
  };

  window.api = {
    chooseFiles: () => new Promise(resolve => { const input = document.createElement('input'); input.type = 'file'; input.multiple = true; input.accept = '.pdf,.docx,.txt,.md'; input.onchange = () => resolve([...input.files].map(file => { const selectionId = id(); FILES.set(selectionId, file); return { selectionId, name: file.name, extension: `.${file.name.split('.').pop()}` }; })); input.click(); }),
    saveUploadedFiles: async (files, uploadDate) => {
      const uploads = read(UPLOADS, []); const saved = [];
      for (const item of files || []) { const file = FILES.get(item.selectionId); FILES.delete(item.selectionId); if (!file) continue; const text = await extract(file); const upload = { id: id(), uploadNumber: uploads.length + 1, name: item.name || file.name, uploadedAt: date(uploadDate), objectives: objectives(text), text, textLength: text.length, readingStatus: text.trim().length < 40 ? 'unreadable' : text.trim().length < 200 ? 'limited' : 'ready' }; uploads.push(upload); saved.push(upload); }
      write(UPLOADS, uploads); return saved;
    },
    getUploads: async () => read(UPLOADS, []),
    getUploadsForDate: async key => read(UPLOADS, []).filter(upload => upload.uploadedAt.slice(0, 10) === key),
    deleteUpload: async uploadId => { write(UPLOADS, read(UPLOADS, []).filter(upload => upload.id !== uploadId)); return { ok: true }; },
    generateStudyPack: async (uploadId, mode, force) => { const packs = read(PACKS, {}); const key = packKey(uploadId, mode); if (!force && packs[key]) return { ok: true, pack: packs[key], cached: true }; const uploads = read(UPLOADS, []); const upload = uploadId === '__all__' ? { name: 'All documents', text: uploads.map(item => item.text).join('\n'), objectives: uploads.flatMap(item => item.objectives || []) } : uploads.find(item => item.id === uploadId); if (!upload) return { ok: false, error: 'No uploaded document was found.' }; const fallback = localPack(upload); const pack = await geminiJson(`Create a healthcare exam study pack from this document. Return JSON only with objectives, multipleChoice, and longAnswer. MCQ options need label, text, isCorrect, explanation. Long answers need id, type, sourceDocument, question, modelAnswer, documentAnswer, rubric. Use only the document facts. DOCUMENT: ${upload.text}`, () => fallback); pack.answers = pack.answers || {}; pack.generatedWith = pack.generatedWith || 'Gemini (on device)'; pack.generatedAt = new Date().toISOString(); packs[key] = pack; write(PACKS, packs); return { ok: true, pack, usedFallback: pack === fallback }; },
    resetStudyPack: async (uploadId, mode) => { const packs = read(PACKS, {}); delete packs[packKey(uploadId, mode)]; write(PACKS, packs); return { ok: true }; },
    saveStudyAnswer: async payload => { const packs = read(PACKS, {}); const pack = packs[packKey(payload.uploadId, payload.mode)]; if (!pack) return { ok: false }; pack.answers = pack.answers || {}; pack.answers[payload.questionId] = { selectedLabel: payload.selectedLabel || '', text: payload.text || '', feedback: payload.feedback || null, updatedAt: new Date().toISOString() }; write(PACKS, packs); return { ok: true, answer: pack.answers[payload.questionId] }; },
    gradeLongAnswer: async payload => { const fallback = { verdict: 'Review needed', score: 0, explanation: 'Compare your answer with the model answer and rubric.', improvements: ['Add the key points from the uploaded document.'] }; const feedback = await geminiJson(`Mark this healthcare answer. Return JSON only: {"verdict":string,"score":number,"explanation":string,"improvements":[string]}. Question: ${payload.question} Rubric: ${JSON.stringify(payload.rubric || [])} Model answer: ${payload.modelAnswer} Student answer: ${payload.userAnswer}`, () => fallback); return { ok: true, feedback, usedFallback: feedback === fallback }; },
    generateOsceStations: async payload => { const topic = String(payload?.topic || '').trim(); if (!topic) return { ok: false, error: 'Enter a topic for your OSCE scenarios.' }; const docs = read(UPLOADS, []).filter(upload => (payload.docIds || []).includes(upload.id)); const fallback = { stations: [] }; const result = await geminiJson(`Create 4 safe educational OSCE stations about ${topic}. Return JSON only: {"stations":[{"id":string,"title":string,"durationSeconds":900,"candidateBrief":string,"patientBrief":string,"patientInformation":string,"examinerInstructions":string,"expectedActions":[string],"redFlags":[string],"markingChecklist":[{"id":string,"label":string,"isRedFlag":boolean,"points":number}],"globalRating":{"scale":["Fail","Borderline","Pass","Clear Pass"],"descriptor":string},"modelAnswer":string}]}. Use this source material when relevant: ${docs.map(doc => doc.text).join('\n')}`, () => fallback); if (!Array.isArray(result.stations) || !result.stations.length) return { ok: false, error: 'Gemini could not generate OSCE stations. Check your API key and connection.' }; return { ok: true, stations: result.stations.map((station, index) => ({ ...station, id: station.id || id(), durationSeconds: 900, sourceDocIds: payload.docIds || [], generationSource: 'gemini' })), source: 'gemini' }; },
    markOscePerformance: async payload => { const fallback = { verdict: 'Review needed', score: 0, strengths: [], improvements: ['Compare your performance with the checklist.'] }; const result = await geminiJson(`Mark this educational OSCE performance. Return JSON only: {"verdict":string,"score":number,"strengths":[string],"improvements":[string]}. Checklist: ${JSON.stringify(payload.station?.markingChecklist || [])}. Diagnosis: ${payload.workingDiagnosis}. Candidate performance: ${payload.candidatePerformance}. Transcript: ${JSON.stringify(payload.candidateTranscript || [])}`, () => fallback); return { ok: true, result, usedFallback: result === fallback }; },
    oscePatientChat: async payload => { if (!payload?.candidateMessage) return { ok: false, error: 'Ask the patient a question first.' }; const reply = await geminiText(`Role-play only as this OSCE patient. Answer in natural lay language using only the patient brief. Do not reveal diagnosis, marking, or teaching notes. Patient brief: ${payload.station?.patientBrief}. Conversation: ${JSON.stringify(payload.history || [])}. Candidate: ${payload.candidateMessage}`, () => 'Could you explain that in simpler terms?'); return { ok: true, reply, source: 'gemini' }; }
  };
})();

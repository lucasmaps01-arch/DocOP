const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  chooseFiles: () => ipcRenderer.invoke('choose-files'),
  saveUploadedFiles: (files) => ipcRenderer.invoke('save-uploaded-files', files),
  deleteUpload: (uploadId) => ipcRenderer.invoke('delete-upload', uploadId),
  selectFiles: () => ipcRenderer.invoke('select-files'),
  getUploads: () => ipcRenderer.invoke('get-uploads'),
  getUploadsForDate: (dateStr) => ipcRenderer.invoke('uploads-for-date', dateStr),
  generateStudyPack: (uploadId, mode, force) => ipcRenderer.invoke('generate-study-pack', uploadId, mode, force),
  resetStudyPack: (uploadId, mode) => ipcRenderer.invoke('reset-study-pack', uploadId, mode),
  saveStudyAnswer: (payload) => ipcRenderer.invoke('save-study-answer', payload),
  gradeLongAnswer: (payload) => ipcRenderer.invoke('grade-long-answer', payload),
  generateOsceStations: (payload) => ipcRenderer.invoke('generate-osce-stations', payload),
  markOscePerformance: (payload) => ipcRenderer.invoke('mark-osce-performance', payload),
  oscePatientChat: (payload) => ipcRenderer.invoke('osce-patient-chat', payload)
});

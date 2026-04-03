export const uploadPolicy = {
  acceptedMimeTypes: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  proposalMaxFileSizeMb: 20,
  proposalMaxTotalSizeMb: 100,
  reportMaxFileSizeMb: 20,
  reportMaxTotalSizeMb: 100,
};

export function bytesFromMb(value: number) {
  return value * 1024 * 1024;
}

export function validateUploadBatch(files: { size: number; type: string }[]) {
  const total = files.reduce((sum, file) => sum + file.size, 0);
  const invalidType = files.some(
    (file) => !uploadPolicy.acceptedMimeTypes.includes(file.type),
  );
  const oversizeFile = files.some(
    (file) => file.size > bytesFromMb(uploadPolicy.reportMaxFileSizeMb),
  );

  return {
    total,
    invalidType,
    oversizeFile,
    overTotal: total > bytesFromMb(uploadPolicy.reportMaxTotalSizeMb),
  };
}

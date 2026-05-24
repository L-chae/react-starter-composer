const path = require('path');

function validateDownloadZipFileName(zipFileName) {
  if (typeof zipFileName !== 'string' || zipFileName.trim() === '') {
    return {
      ok: false,
      error: 'zipFileName must be a non-empty string.',
    };
  }

  // Block residual encoded traversal patterns such as %2e%2e%2f.
  if (zipFileName.includes('%')) {
    return {
      ok: false,
      error: 'Encoded filename is not allowed.',
    };
  }

  if (!zipFileName.toLowerCase().endsWith('.zip')) {
    return {
      ok: false,
      error: 'Only .zip files are allowed.',
    };
  }

  if (zipFileName !== path.basename(zipFileName)) {
    return {
      ok: false,
      error: 'Invalid zip file name.',
    };
  }

  if (zipFileName.includes('..') || zipFileName.includes('/') || zipFileName.includes('\\')) {
    return {
      ok: false,
      error: 'Path traversal is not allowed.',
    };
  }

  if (!/^[a-zA-Z0-9._-]+\.zip$/.test(zipFileName)) {
    return {
      ok: false,
      error: 'zipFileName contains unsupported characters.',
    };
  }

  return { ok: true };
}

module.exports = {
  validateDownloadZipFileName,
};

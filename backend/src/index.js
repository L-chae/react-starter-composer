const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const { buildComposerResult } = require('./composer');
const { generateProjectFromComposerResult } = require('./project-generator');
const { zipGeneratedProject } = require('./zipper');

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '';
const ZIP_OUTPUT_ROOT = path.resolve(__dirname, '../output/zips');

app.use(
  cors({
    origin(origin, callback) {
      if (!CORS_ORIGIN) {
        return callback(null, true);
      }

      if (!origin || origin === CORS_ORIGIN) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
  }),
);
app.use(express.json({ limit: '1mb' }));

function isSafeZipFileName(zipFileName) {
  if (typeof zipFileName !== 'string' || zipFileName.trim() === '') {
    return false;
  }

  if (!zipFileName.toLowerCase().endsWith('.zip')) {
    return false;
  }

  if (zipFileName !== path.basename(zipFileName)) {
    return false;
  }

  if (zipFileName.includes('..') || zipFileName.includes('/') || zipFileName.includes('\\')) {
    return false;
  }

  return /^[a-zA-Z0-9._-]+\.zip$/.test(zipFileName);
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/generate', async (req, res) => {
  try {
    const composed = buildComposerResult(req.body);

    if (!composed.ok) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid generate request',
        errors: composed.errors || [],
      });
    }

    const generated = generateProjectFromComposerResult(composed.result);
    const zipped = await zipGeneratedProject(generated.outputPath, composed.result.projectName);

    return res.json({
      ok: true,
      message: 'Project files generated and zipped',
      result: composed.result,
      outputPath: generated.outputPath,
      generatedFiles: generated.generatedFiles,
      zipPath: zipped.zipPath,
      zipFileName: zipped.zipFileName,
      zipSizeBytes: zipped.sizeBytes,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: 'Failed to build composer result',
      errors: [error.message],
    });
  }
});

app.get('/api/download/:zipFileName', (req, res) => {
  const { zipFileName } = req.params;

  if (!isSafeZipFileName(zipFileName)) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid zip file name',
    });
  }

  const zipPath = path.resolve(ZIP_OUTPUT_ROOT, zipFileName);
  const relative = path.relative(ZIP_OUTPUT_ROOT, zipPath);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid zip file path',
    });
  }

  if (!fs.existsSync(zipPath)) {
    return res.status(404).json({
      ok: false,
      message: 'ZIP file not found',
    });
  }

  return res.download(zipPath, zipFileName);
});

app.listen(PORT, () => {
  console.log('Backend server listening on port ' + PORT);
});

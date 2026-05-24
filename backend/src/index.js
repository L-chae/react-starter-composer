const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const { buildComposerResult } = require('./composer');
const { generateProjectFromComposerResult } = require('./project-generator');
const { zipGeneratedProject } = require('./zipper');
const { validateDownloadZipFileName } = require('./download-validator');

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

function sendError(res, statusCode, errors) {
  const normalizedErrors = Array.isArray(errors)
    ? errors.filter((item) => typeof item === 'string' && item.trim() !== '')
    : ['Unknown error'];

  return res.status(statusCode).json({
    ok: false,
    errors: normalizedErrors.length > 0 ? normalizedErrors : ['Unknown error'],
  });
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/generate', async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return sendError(res, 400, ['Request body must be a JSON object.']);
    }

    const composed = buildComposerResult(req.body);

    if (!composed.ok) {
      return sendError(res, 400, composed.errors || ['Invalid generate request.']);
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
    return sendError(res, 500, [error instanceof Error ? error.message : 'Internal server error.']);
  }
});

app.get('/api/download/:zipFileName', (req, res) => {
  const { zipFileName } = req.params;
  const validation = validateDownloadZipFileName(zipFileName);

  if (!validation.ok) {
    return sendError(res, 400, [validation.error]);
  }

  const zipPath = path.resolve(ZIP_OUTPUT_ROOT, zipFileName);
  const relative = path.relative(ZIP_OUTPUT_ROOT, zipPath);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return sendError(res, 400, ['Invalid zip file path.']);
  }

  if (!fs.existsSync(zipPath)) {
    return sendError(res, 404, ['ZIP file not found.']);
  }

  return res.download(zipPath, zipFileName, (error) => {
    if (!error) {
      return;
    }

    if (res.headersSent) {
      return;
    }

    if (error.code === 'ENOENT') {
      sendError(res, 404, ['ZIP file not found.']);
      return;
    }

    sendError(res, 500, ['Failed to send ZIP file.']);
  });
});

app.use((_req, res) => {
  sendError(res, 404, ['Not found.']);
});

app.use((error, _req, res, _next) => {
  if (res.headersSent) {
    return;
  }

  if (error && error.type === 'entity.parse.failed') {
    sendError(res, 400, ['Invalid JSON body.']);
    return;
  }

  if (error && error.message === 'Not allowed by CORS') {
    sendError(res, 400, ['Not allowed by CORS.']);
    return;
  }

  sendError(res, 500, [error instanceof Error ? error.message : 'Internal server error.']);
});

app.listen(PORT, () => {
  console.log('Backend server listening on port ' + PORT);
});

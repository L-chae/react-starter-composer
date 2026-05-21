const cors = require('cors');
const express = require('express');
const { buildComposerResult } = require('./composer');
const { generateProjectFromComposerResult } = require('./project-generator');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/generate', (req, res) => {
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

    return res.json({
      ok: true,
      message: 'Project files generated',
      result: composed.result,
      outputPath: generated.outputPath,
      generatedFiles: generated.generatedFiles,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: 'Failed to build composer result',
      errors: [error.message],
    });
  }
});

app.listen(PORT, () => {
  console.log('Backend server listening on port ' + PORT);
});

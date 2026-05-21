const cors = require('cors');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function validateGenerateOptions(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return {
      ok: false,
      message: 'Request body must be a JSON object.',
    };
  }

  const {
    projectName,
    language,
    styling,
    useVitest = false,
    useZustand = false,
    useLucide = false,
    usePrettier = false,
  } = body;

  const errors = [];

  if (typeof projectName !== 'string' || projectName.trim() === '') {
    errors.push('projectName must be a non-empty string.');
  }

  if (!['ts', 'js'].includes(language)) {
    errors.push("language must be either 'ts' or 'js'.");
  }

  if (!['css', 'tailwind'].includes(styling)) {
    errors.push("styling must be either 'css' or 'tailwind'.");
  }

  const flagChecks = [
    ['useVitest', useVitest],
    ['useZustand', useZustand],
    ['useLucide', useLucide],
    ['usePrettier', usePrettier],
  ];

  for (const [name, value] of flagChecks) {
    if (typeof value !== 'boolean') {
      errors.push(name + ' must be a boolean.');
    }
  }

  if (errors.length > 0) {
    return {
      ok: false,
      message: 'Invalid generate options.',
      errors,
    };
  }

  return {
    ok: true,
    options: {
      projectName: projectName.trim(),
      language,
      styling,
      useVitest,
      useZustand,
      useLucide,
      usePrettier,
    },
  };
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/generate', (req, res) => {
  const validation = validateGenerateOptions(req.body);

  if (!validation.ok) {
    return res.status(400).json({
      ok: false,
      message: validation.message,
      errors: validation.errors || [],
    });
  }

  return res.json({
    ok: true,
    message: 'Generate endpoint is ready',
    options: validation.options,
  });
});

app.listen(PORT, () => {
  console.log('Backend server listening on port ' + PORT);
});

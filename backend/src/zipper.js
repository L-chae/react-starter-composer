const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const BACKEND_ROOT = path.resolve(__dirname, '..');
const ZIP_OUTPUT_ROOT = path.resolve(BACKEND_ROOT, 'output/zips');

function ensureWithin(parentDir, targetPath, label) {
  const relative = path.relative(parentDir, targetPath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(label + ' is outside allowed directory: ' + targetPath);
  }
}

function zipGeneratedProject(projectPath, projectName) {
  if (!projectPath || typeof projectPath !== 'string') {
    return Promise.reject(new Error('projectPath must be a non-empty string.'));
  }

  if (!projectName || typeof projectName !== 'string') {
    return Promise.reject(new Error('projectName must be a non-empty string.'));
  }

  const sourceDir = path.resolve(projectPath);

  if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
    return Promise.reject(new Error('Generated project folder does not exist: ' + sourceDir));
  }

  fs.mkdirSync(ZIP_OUTPUT_ROOT, { recursive: true });

  const zipFileName = projectName + '.zip';
  const zipPath = path.resolve(ZIP_OUTPUT_ROOT, zipFileName);
  ensureWithin(ZIP_OUTPUT_ROOT, zipPath, 'ZIP path');

  fs.rmSync(zipPath, { force: true });

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      const stat = fs.statSync(zipPath);
      resolve({
        zipPath,
        zipFileName,
        sizeBytes: stat.size,
      });
    });

    output.on('error', (error) => reject(error));
    archive.on('error', (error) => reject(error));

    archive.pipe(output);
    // Add only the project contents so ZIP root shows package.json/src/README.md.
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

module.exports = {
  zipGeneratedProject,
};

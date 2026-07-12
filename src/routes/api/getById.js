const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');
const MarkdownIt = require('markdown-it');
const path = require('path');

const md = new MarkdownIt();

// Mapping of extensions to mime types
const extToMime = {
  '.html': 'text/html',
  '.md': 'text/markdown',
  '.txt': 'text/plain',
  '.json': 'application/json',
};

module.exports = async (req, res) => {
  try {
    const ext = path.extname(req.params.id);
    const id = ext ? req.params.id.slice(0, -ext.length) : req.params.id;

    const fragment = await Fragment.byId(req.user, id);
    let data = await fragment.getData();

    if (ext) {
      const targetMime = extToMime[ext];
      if (!targetMime) {
        return res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
      }

      if (!fragment.formats.includes(targetMime)) {
        return res.status(415).json(createErrorResponse(415, 'Unsupported Media Type for Conversion'));
      }

      if (targetMime === 'text/html' && fragment.type === 'text/markdown') {
        data = Buffer.from(md.render(data.toString('utf-8')));
      }

      res.setHeader('Content-Type', targetMime);
    } else {
      res.setHeader('Content-Type', fragment.type);
    }

    res.status(200).send(data);
  } catch (err) {
    logger.error({ err }, 'Error fetching fragment by ID');
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};

const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')

function load(path, imports = {}) {
  const source = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const module = { exports: {} }
  new Function('require', 'module', 'exports', source)((name) => imports[name] || require(name), module, module.exports)
  return module.exports
}
const links = load('lib/socialLinks.ts')

test('missing settings preserve TikTok, saved empty fields hide all networks', () => {
  assert.equal(links.readSocialLinks().tiktok, links.DEFAULT_SOCIAL_LINKS.tiktok)
  assert.ok(Object.values(links.readSocialLinks({})).every(value => value === ''))
})
test('URL validation rejects unsafe schemes, credentials, malformed and oversized input', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,test', 'ftp://example.com', 'https://user:pass@example.com', 'instagram.com/profile', 'https://example.com/' + 'a'.repeat(2048)]) {
    assert.throws(() => links.normalizeSocialUrl(value))
  }
  assert.equal(links.normalizeSocialUrl(' https://instagram.com/example '), 'https://instagram.com/example')
  assert.equal(links.normalizeSocialUrl('  '), '')
  assert.equal(links.readSocialLinks({ tiktok: 'javascript:alert(1)' }).tiktok, '')
})

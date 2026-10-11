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
const partners = load('lib/partners.ts', { './socialLinks': load('lib/socialLinks.ts') })

test('saving trims names, normalizes URLs and drops fully blank rows', () => {
  assert.deepEqual(partners.validatePartners([
    { name: '  Gasco   a.s. ', url: ' https://www.gasco.cz ' },
    { name: '', url: '  ' },
    { name: 'Bez webu', url: '' },
  ]), [{ name: 'Gasco a.s.', url: 'https://www.gasco.cz/' }, { name: 'Bez webu', url: '' }])
})
test('saving rejects missing names, unsafe URLs, long names and too many companies', () => {
  assert.throws(() => partners.validatePartners([{ name: '', url: 'https://example.com' }]))
  assert.throws(() => partners.validatePartners([{ name: 'X', url: 'javascript:alert(1)' }]))
  assert.throws(() => partners.validatePartners([{ name: 'a'.repeat(101), url: '' }]))
  assert.throws(() => partners.validatePartners(Array.from({ length: 51 }, (_, i) => ({ name: `F${i}`, url: '' }))))
  assert.throws(() => partners.validatePartners('not a list'))
})
test('reading skips malformed entries and tolerates missing data', () => {
  assert.deepEqual(partners.readPartners(), [])
  assert.deepEqual(partners.readPartners({ companies: 'x' }), [])
  assert.deepEqual(partners.readPartners({ companies: [
    { name: 'OK', url: 'https://ok.cz' }, { name: 'Bad', url: 'javascript:alert(1)' }, null, { name: 5 },
  ] }), [{ name: 'OK', url: 'https://ok.cz/' }])
})

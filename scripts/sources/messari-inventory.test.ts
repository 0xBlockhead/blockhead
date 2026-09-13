import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { describeStandard, revision, run } from './messari-inventory.ts'

test('preserves wire cardinality, abstract relationships, and derivation without converting them to domain assumptions', () => {
	const input = `# Version: 3.1.0
interface Event { id: Bytes! }
type Transfer implements Event @entity {
  id: Bytes!
  "Exact raw amount, not a JavaScript float"
  amount: BigInt!
  tokens: [Token!]
  children: [Transfer!]! @derivedFrom(field: "parent")
}
type Token @entity { id: Bytes! }
type _Cache @entity { id: ID! }
enum Side { BORROWER LENDER }
`
	const standard = describeStandard('schema-lending.graphql', input)
	assert.equal(standard.version, '3.1.0')
	assert.equal(standard.sha256, createHash('sha256').update(input).digest('hex'))
	assert.equal(standard.entities[0]?.kind, 'interface')
	assert.deepEqual(standard.entities[1]?.interfaces, ['Event'])
	assert.deepEqual(standard.entities[1]?.fields.map(({ name, type }) => [name, type]), [
		['id', 'Bytes!'],
		['amount', 'BigInt!'],
		['tokens', '[Token!]'],
		['children', '[Transfer!]!'],
	])
	assert.deepEqual(standard.entities[1]?.fields[3]?.directives, ['@derivedFrom(field: "parent")'])
	assert.equal(standard.entities[1]?.fields[1]?.description, 'Exact raw amount, not a JavaScript float')
	assert.equal(standard.entities[3]?.internal, true)
	assert.deepEqual(standard.enums, [{ name: 'Side', values: ['BORROWER', 'LENDER'] }])
})

test('rejects malformed SDL instead of treating it as an empty supported standard', () => {
	assert.throws(() => describeStandard('broken.graphql', 'type Pool { amount:'), /Syntax Error/)
})

test('the complete pinned input closure reproduces the inventory offline', async () => {
	await run('check')
	const generic = await readFile(new URL('../../research/messari-standardized-subgraphs/upstream/schema-generic.graphql', import.meta.url), 'utf8')
	assert.equal(describeStandard('schema-generic.graphql', generic).version, '3.0.0')
	assert.match(revision, /^[a-f0-9]{40}$/)
})

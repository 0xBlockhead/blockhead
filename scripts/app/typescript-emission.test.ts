import assert from 'node:assert/strict'
import test from 'node:test'

import { emitTypeScript } from './generate.ts'


test('emits escaped and nested TypeScript literals deterministically', () => {
	assert.equal(
		emitTypeScript({
			kind: 'object',
			entries: [
				['escaped-key', "single' quote\nbackslash\\ and ${template}"],
				['nested', {
					kind: 'array',
					values: [
						-0,
						42,
						9007199254740993n,
						true,
						null,
						{
							kind: 'object',
							entries: [
								['empty', {
									kind: 'array',
									values: [],
								}],
							],
						},
					],
				}],
			],
		}),
		[
			'{',
			"\t'escaped-key': 'single\\' quote\\nbackslash\\\\ and ${template}',",
			'\tnested: [',
			'\t\t-0,',
			'\t\t42,',
			'\t\t9007199254740993n,',
			'\t\ttrue,',
			'\t\tnull,',
			'\t\t{',
			'\t\t\tempty: [],',
			'\t\t},',
			'\t],',
			'}',
		].join('\n')
	)
})

test('emits member references, calls, raw expressions, and structured values', () => {
	assert.equal(
		emitTypeScript({
			kind: 'call',
			callee: {
				kind: 'member',
				members: [
					'type',
					'unit',
				],
			},
			arguments: ['millisecond'],
		}),
		"type.unit('millisecond')"
	)
	assert.equal(
		emitTypeScript({
			kind: 'array',
			values: [
				{
					kind: 'member',
					members: [
						'EntityType',
						'Network',
					],
				},
				{
					kind: 'raw',
					source: [
						'resolve({',
						"\tselector: 'slug',",
						'})',
					].join('\n'),
				},
			],
		}),
		[
			'[',
			'\tEntityType.Network,',
			'\tresolve({',
			"\t\tselector: 'slug',",
			'\t}),',
			']',
		].join('\n')
	)
	assert.equal(
		emitTypeScript({
			kind: 'value',
			value: [{
				id: 'root',
				enabled: false,
				children: [],
				omitted: undefined,
			}],
		}),
		[
			'[',
			'\t{',
			"\t\tid: 'root',",
			'\t\tenabled: false,',
			'\t\tchildren: [],',
			'\t},',
			']',
		].join('\n')
	)
})

import { describe, expect, it } from 'vitest'

import {
	inspectRepository,
	inspectRepositoryPayload,
	listRepositories,
	listIssues,
	listPatches,
	nodeId,
	nodeStatus,
	repositorySyncStatus,
	showIssue,
	showPatch,
} from '$/sources/RadicleCli/Local/queries.ts'

const repositoryId = 'rad:z3gqcJUoA1n9HaHKufZs5FCSGazv5D6Dt7Fnx1C4h2kKz'
const collaborativeObjectId = 'e5f0a5a5adaa33c3b931235967e4930ece9bb617'

describe('Radicle CLI local inspection command', () => {
	it('preserves a valid repository identifier as one inspect argument', () => {
		expect(inspectRepository(repositoryId)).toEqual({
			command: 'rad',
			args: [
				'inspect',
				repositoryId,
			],
		})
	})

	it('rejects malformed or option-shaped repository identifiers before command construction', () => {
		for (const invalidRepositoryId of [
			'',
			'--help',
			'rad:zinvalid-identifier',
			`${repositoryId}\n--json`,
		])
			expect(() => inspectRepository(invalidRepositoryId)).toThrow('invalid repository ID')
	})

	it('constructs repository identity and inventory reads without mutation flags', () => {
		expect(inspectRepositoryPayload(repositoryId)).toEqual({
			command: 'rad',
			args: [
				'inspect',
				'--payload',
				repositoryId,
			],
		})
		expect(listRepositories()).toEqual({
			command: 'rad',
			args: ['ls'],
		})
		expect(listRepositories(true)).toEqual({
			command: 'rad',
			args: [
				'ls',
				'--private',
			],
		})
	})

	it('constructs node identity, health and repository sync observations', () => {
		expect(nodeStatus()).toEqual({
			command: 'rad',
			args: [
				'node',
				'status',
			],
		})
		expect(nodeId()).toEqual({
			command: 'rad',
			args: [
				'node',
				'status',
				'--only',
				'nid',
			],
		})
		expect(repositorySyncStatus()).toEqual({
			command: 'rad',
			args: [
				'sync',
				'status',
			],
		})
	})

	it('constructs issue and patch lifecycle reads against the current repository', () => {
		expect(listIssues()).toEqual({
			command: 'rad',
			args: ['issue'],
		})
		expect(showIssue(collaborativeObjectId)).toEqual({
			command: 'rad',
			args: [
				'issue',
				'show',
				collaborativeObjectId,
			],
		})
		expect(listPatches()).toEqual({
			command: 'rad',
			args: ['patch'],
		})
		expect(listPatches(true)).toEqual({
			command: 'rad',
			args: [
				'patch',
				'--merged',
			],
		})
		expect(showPatch(collaborativeObjectId)).toEqual({
			command: 'rad',
			args: [
				'patch',
				'show',
				collaborativeObjectId,
			],
		})
	})

	it('requires complete canonical collaborative object identifiers', () => {
		for (const invalidCollaborativeObjectId of [
			'',
			'e5f0a5a',
			'--help',
			`${collaborativeObjectId}\n--help`,
		]) {
			expect(() => showIssue(invalidCollaborativeObjectId)).toThrow('invalid collaborative object ID')
			expect(() => showPatch(invalidCollaborativeObjectId)).toThrow('invalid collaborative object ID')
		}
	})
})

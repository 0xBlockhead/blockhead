import { describe, expect, it } from 'vitest'

import { inspectRepository } from '$/sources/RadicleCli/Local/queries.ts'

const repositoryId = 'rad:z3gqcJUoA1n9HaHKufZs5FCSGazv5D6Dt7Fnx1C4h2kKz'

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
})

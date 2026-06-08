import {
	describe,
	expect,
	it,
} from 'vitest'
import {
	readFileSync,
	readdirSync,
} from 'node:fs'
import { join } from 'node:path'

import {
	EntityFieldCardinality,
	entityFieldDefinitions,
} from '$/schema/$EntityDefinition.ts'
import { entityDefinitionByType } from '$/schema/index.ts'
import {
	defaultResolverContextRowLimit,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	resolverCountPartsByEntityTypeAndFieldName,
	resolverDefinitions,
	resolverDiscriminatorPartsByEntityTypeAndConditionKey,
	resolverLivePartsByEntityTypeAndFieldName,
	resolverRootLivePartsByEntityType,
	resolverValuePartsByEntityTypeAndFieldName,
} from '$/resolvers/index.ts'


const srcPath = join(
	process.cwd(),
	'src',
)

const sourceFiles = (
	directory: string,
): string[] => (
	readdirSync(directory, {
		withFileTypes: true,
	})
		.flatMap((entry) => (
			entry.isDirectory() ?
				sourceFiles(join(directory, entry.name))
			: /\.(?:svelte|ts)$/.test(entry.name) ?
				[join(directory, entry.name)]
			:
				[]
		))
)

describe('useEntity resolver architecture', () => {
	it('exposes only the strict Resolver Context shape to real resolvers', () => {
		expect(resolverContextRowLimit({
			Filters: [],
			Sorts: [],
			Pagination: {
				limit: 7,
			},
			IdentityFilter: [],
			ParentIdentityFilter: [],
			SourceFilter: [],
			publicEnv: {},
		})).toBe(7)
		expect(resolverContextRowLimit({
			Filters: [],
			Sorts: [],
			Pagination: {},
			IdentityFilter: [],
			ParentIdentityFilter: [],
			SourceFilter: [],
			publicEnv: {},
		})).toBe(defaultResolverContextRowLimit)
	})

	it('keeps TanStack DB on-demand IR as the resolver persistence boundary', () => {
		expect(readFileSync(
			join(srcPath, 'collections', '$collections.ts'),
			'utf8',
		)).toContain('resolverContextFromSubset')
		expect(readFileSync(
			join(srcPath, 'collections', '$collections.ts'),
			'utf8',
		)).toContain("syncMode: 'on-demand'")
		expect(readFileSync(
			join(srcPath, 'collections', '$collections.ts'),
			'utf8',
		)).toContain('persistedCollectionOptions')
		expect(readFileSync(
			join(srcPath, 'collections', '$queries.svelte.ts'),
			'utf8',
		)).toContain('createLiveQueryCollection')
		expect(readFileSync(
			join(srcPath, 'collections', '$queries.svelte.ts'),
			'utf8',
		)).toContain('orderByIrFromSteps')
	})

	it('does not retain field-specific resolver entry points or context compatibility aliases', () => {
		const source = sourceFiles(srcPath)
			.map((filePath) => readFileSync(filePath, 'utf8'))
			.join('\n')

		expect(source).not.toMatch(/\bdefineEntity(?:Field|FieldCount|Live)?Resolver\b/)
		expect(source).not.toMatch(/\buseEntityField(?:Count)?\b/)
		expect(source).not.toMatch(/\bcontext\.(?:filters|sorts|limit)\b/)
		expect(source).not.toMatch(/\bfilters: subsetBase\.filters\b/)
		expect(source).not.toMatch(/\bsorts: subsetBase\.sorts\b/)
	})

	it('registers every real resolver part through the primary and field-level hierarchy', () => {
		expect(resolverDefinitions.length).toBeGreaterThan(0)
		expect(Object.values(resolverValuePartsByEntityTypeAndFieldName).flat().length).toBeGreaterThan(0)

		for (const resolver of resolverDefinitions) {
			expect(resolver.accepts.length).toBeGreaterThan(0)
			expect(typeof resolver.resolve).toBe('function')
		}

		for (const part of Object.values(resolverValuePartsByEntityTypeAndFieldName).flat()) {
			expect(part.select).toBeDefined()
			expect(part.resolver.entityType).toBe(part.entityType)
			expect(part.resolver.source).toBe(part.source)
		}
	})

	it('only registers count resolvers for multiple-cardinality fields', () => {
		for (const [entityTypeAndFieldName, parts] of Object.entries(resolverCountPartsByEntityTypeAndFieldName)) {
			const [entityType, fieldName] = String(entityTypeAndFieldName).split('\x1E')
			expect(parts.length).toBeGreaterThan(0)
			expect(entityType).toBeDefined()
			expect(fieldName).toBeDefined()
			expect([
				EntityFieldCardinality.Many,
				EntityFieldCardinality.ZeroOrMany,
			]).toContain(
				entityFieldDefinitions(entityDefinitionByType[entityType]).find((field) => (
					field.name === fieldName
				))?.cardinality,
			)
		}
	})

	it('keeps conditional and live resolver registration explicit in the real registry', () => {
		expect(Object.values(resolverDiscriminatorPartsByEntityTypeAndConditionKey).flat().length).toBeGreaterThan(0)
		expect(
			Object.values(resolverLivePartsByEntityTypeAndFieldName).flat().length
			+ Object.values(resolverRootLivePartsByEntityType).flat().length,
		).toBeGreaterThan(0)
	})
})

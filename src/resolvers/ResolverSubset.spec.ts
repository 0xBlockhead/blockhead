import {
	BaseQueryBuilder,
	add,
	and,
	createCollection,
	eq,
	gt,
	inArray,
} from '@tanstack/db'
import type { LoadSubsetOptions } from '@tanstack/db'
import type { IR } from '@tanstack/db'
import { stringify } from 'devalue'
import {
	describe,
	expect,
	it,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import {
	countLoadedSubsetKey,
	fieldLoadedSubsetKey,
	parseResolverSubset,
} from '$/resolvers/$resolvers.ts'


type Row = {
	readonly [EntityMetaKey.SelectorKey]: string
	readonly [EntityMetaKey.ParentSelectorKey]: string
	readonly [EntityMetaKey.Source]: string
	readonly [EntityMetaKey.Value]: string
	readonly category: string
	readonly filterKey: string
	readonly rank: number
	readonly valueKey: string
	readonly nested: {
		readonly value: number
	}
}

const rows = createCollection<Row, string>({
	id: 'ResolverSubset.spec.rows',
	getKey: (row) => row[EntityMetaKey.SelectorKey],
	sync: {
		sync: () => {},
	},
})

const subsetOptions = (
	query: object,
	options: Omit<LoadSubsetOptions, 'where' | 'orderBy'> = {}
): LoadSubsetOptions => {
	const ir = (query as { _getQuery(): IR.QueryIR })._getQuery()
	const where = ir.where?.[0]
	return {
		where: where != null && 'expression' in where ? where.expression : where,
		orderBy: ir.orderBy,
		...options,
	}
}


describe('ResolverSubset parser', () => {
	it('parses supported filters, source filters, identity filters, parent identity filters, sorts, and pagination', () => {
		const whereAndOrder = new BaseQueryBuilder()
			.from({
				row: rows,
			})
			.where(({ row }) => and(
				eq(row[EntityMetaKey.Source], 'SourceA'),
				inArray(row[EntityMetaKey.SelectorKey], [
					'entity-a',
					'entity-b',
				]),
				eq(row[EntityMetaKey.ParentSelectorKey], 'parent-a'),
				eq(row.category, 'public'),
				eq(row.nested.value, 7)
			))
			.orderBy(
				({ row }) => row.rank,
				'desc'
			)
		const cursor = {
			whereFrom: eq(1, 1),
			whereCurrent: eq(2, 2),
			lastKey: 'cursor-key',
		}

		expect(parseResolverSubset(subsetOptions(whereAndOrder, {
			limit: 5,
			offset: 10,
			cursor,
		}))).toEqual({
			filters: [
				{
					fieldPath: [
						EntityMetaKey.Source,
					],
					operator: 'eq',
					value: 'SourceA',
				},
				{
					fieldPath: [
						EntityMetaKey.SelectorKey,
					],
					operator: 'in',
					value: [
						'entity-a',
						'entity-b',
					],
				},
				{
					fieldPath: [
						EntityMetaKey.ParentSelectorKey,
					],
					operator: 'eq',
					value: 'parent-a',
				},
				{
					fieldPath: [
						'category',
					],
					operator: 'eq',
					value: 'public',
				},
				{
					fieldPath: [
						'nested',
						'value',
					],
					operator: 'eq',
					value: 7,
				},
			],
			sorts: [
				{
					fieldPath: [
						'rank',
					],
					direction: 'desc',
				},
			],
			pagination: {
				limit: 5,
				offset: 10,
				cursor,
			},
			sources: [
				'SourceA',
			],
			selectorKeys: [
				'entity-a',
				'entity-b',
			],
			parentSelectorKeys: [
				'parent-a',
			],
		})
	})

	it('parses inclusion source filters, equality identity filters, parent identity filters, and ascending sorts', () => {
		expect(parseResolverSubset(subsetOptions(
			new BaseQueryBuilder()
				.from({
					row: rows,
				})
				.where(({ row }) => and(
					inArray(row[EntityMetaKey.Source], [
						'SourceA',
						'SourceB',
					]),
					eq(row[EntityMetaKey.SelectorKey], 'entity-a'),
					inArray(row[EntityMetaKey.ParentSelectorKey], [
						'parent-a',
						'parent-b',
					])
				))
				.orderBy(
					({ row }) => row.category,
					'asc'
				)
		))).toMatchObject({
			sorts: [
				{
					fieldPath: [
						'category',
					],
					direction: 'asc',
				},
			],
			sources: [
				'SourceA',
				'SourceB',
			],
			selectorKeys: [
				'entity-a',
			],
			parentSelectorKeys: [
				'parent-a',
				'parent-b',
			],
		})
	})

	it('preserves empty source inclusion filters as an explicit empty source set', () => {
		expect(parseResolverSubset(subsetOptions(
			new BaseQueryBuilder()
				.from({
					row: rows,
				})
				.where(({ row }) => inArray(row[EntityMetaKey.Source], []))
		)).sources).toEqual([])
	})

	it('rejects unsupported filter operators explicitly', () => {
		expect(() => parseResolverSubset(subsetOptions(
			new BaseQueryBuilder()
				.from({
					row: rows,
				})
				.where(({ row }) => gt(row.rank, 1))
		))).toThrow('Resolver Subset Parser unsupported where LoadSubsetOptions')
	})

	it('rejects object-valued filters instead of broad JSON-like filter values', () => {
		expect(() => parseResolverSubset(subsetOptions(
			new BaseQueryBuilder()
				.from({
					row: rows,
				})
				.where(({ row }) => eq(row.nested, {
					value: 7,
				}))
		))).toThrow('Resolver Subset Parser unsupported where LoadSubsetOptions')
	})

	it('rejects unsupported order expressions explicitly', () => {
		expect(() => parseResolverSubset(subsetOptions(
			new BaseQueryBuilder()
				.from({
					row: rows,
				})
				.orderBy(({ row }) => add(row.rank, 1))
		))).toThrow('Resolver Subset Parser unsupported orderBy LoadSubsetOptions')
	})

	it('keys field subsets by row filters, order, and window while count subsets keep only parent, source, and count filter', () => {
		const fieldKeys = new Set<string>()
		const countKeys = new Set<string>()
		for (let index = 0; index < 512; index += 1) {
			const loadSubsetOptions = subsetOptions(
				new BaseQueryBuilder()
					.from({
						row: rows,
					})
					.where(({ row }) => and(
						eq(row[EntityMetaKey.ParentSelectorKey], (index & 1) === 0 ? 'parent-a' : 'parent-b'),
						eq(row[EntityMetaKey.Source], (index & 2) === 0 ? 'SourceA' : 'SourceB'),
						eq(row.filterKey, (index & 4) === 0 ? 'filter-a' : 'filter-b'),
						eq(row.valueKey, (index & 64) === 0 ? 'value-a' : 'value-b'),
						eq(row[EntityMetaKey.Value], (index & 128) === 0 ? 'A' : 'B'),
						eq(row.category, (index & 256) === 0 ? 'public' : 'private')
					))
					.orderBy(
						({ row }) => row.rank,
						(index & 8) === 0 ? 'asc' : 'desc'
					),
				{
					...((index & 16) !== 0 && {
						limit: 10,
					}),
					...((index & 32) !== 0 && {
						cursor: {
							whereFrom: eq(1, 1),
							whereCurrent: eq(2, 2),
							lastKey: 'cursor-key',
						},
					}),
				}
			)
			fieldKeys.add(stringify(fieldLoadedSubsetKey(loadSubsetOptions)))
			countKeys.add(stringify(countLoadedSubsetKey(loadSubsetOptions)))
		}

		expect(fieldKeys.size).toBe(512)
		expect(countKeys.size).toBe(8)
	})

	it('normalizes count subset keys to the dimensions that identify a count row', () => {
		expect(countLoadedSubsetKey(subsetOptions(
			new BaseQueryBuilder()
				.from({
					row: rows,
				})
				.where(({ row }) => and(
					eq(row[EntityMetaKey.ParentSelectorKey], 'parent-a'),
					inArray(row[EntityMetaKey.Source], [
						'SourceB',
						'SourceA',
					]),
					eq(row.valueKey, 'value-a'),
					eq(row[EntityMetaKey.Value], 'A'),
					eq(row.filterKey, 'filter-a')
				))
				.orderBy(
					({ row }) => row.rank,
					'desc'
				),
			{
				limit: 10,
				offset: 5,
				cursor: {
					whereFrom: eq(1, 1),
					whereCurrent: eq(2, 2),
					lastKey: 'cursor-key',
				},
			}
		))).toEqual({
			filters: [
				{
					fieldPath: [EntityMetaKey.ParentSelectorKey],
					operator: 'eq',
					value: 'parent-a',
				},
				{
					fieldPath: [EntityMetaKey.Source],
					operator: 'in',
					value: [
						'SourceA',
						'SourceB',
					],
				},
				{
					fieldPath: ['filterKey'],
					operator: 'eq',
					value: 'filter-a',
				},
			],
		})
	})
})

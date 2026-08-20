import {
	BaseQueryBuilder,
	and,
	createCollection,
	eq,
} from '@tanstack/db'
import { stringify } from 'devalue'
import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	defaultResolverContextRowLimit,
	fieldLoadedSubsetKey,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'


describe('client resolver architecture', () => {
	it('applies explicit and default resolver context limits', () => {
		expect(resolverContextRowLimit({
			filters: [],
			sorts: [],
			pagination: {
				limit: 7,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})).toBe(7)
		expect(resolverContextRowLimit({
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})).toBe(defaultResolverContextRowLimit)
	})

	it('keeps field loaded-subset keys distinct across subscribe limits', () => {
		type Row = {
			readonly [EntityMetaKey.ParentSelectorKey]: string
			readonly [EntityMetaKey.Source]: string
			readonly valueKey: string
			readonly valueIndex?: number
		}

		const rows = createCollection<Row, string>({
			id: 'subscribe-architecture.spec.field-rows',
			getKey: (row) => row.valueKey,
			sync: {
				sync: () => {},
			},
		})

		const subsetOptions = (limit: number) => {
			const query = new BaseQueryBuilder()
				.from({
					row: rows,
				})
				.where(({ row }) => (
					and(
						eq(row[EntityMetaKey.ParentSelectorKey], 'parent-a'),
						eq(row[EntityMetaKey.Source], 'SourceA')
					)
				))
				.orderBy(
					({ row }) => row.valueKey,
					'asc'
				)
				.limit(limit)
			const ir = (query as { _getQuery(): { where?: { expression?: unknown }[], orderBy?: unknown } })._getQuery()
			const where = ir.where?.[0]
			return {
				where: where != null && 'expression' in where ? where.expression : where,
				orderBy: ir.orderBy,
				limit,
			}
		}

		const keys = [
			1,
			2,
		].map((limit) => stringify(fieldLoadedSubsetKey(subsetOptions(limit))))

		expect(keys[0]).not.toBe(keys[1])
	})
})

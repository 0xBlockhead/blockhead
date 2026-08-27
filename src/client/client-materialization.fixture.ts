import { type as arktype } from 'arktype'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'

export const materializationFixtureSchema = [
	entity({
		entityType: 'MaterializationParent',
		labels: {
			singular: 'Materialization parent',
			plural: 'Materialization parents',
		},
	})({
		slug: {
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.One,
		},
		values: {
			primitiveType: arktype('number'),
			cardinality: EntityFieldCardinality.Many,
		},
		$$children: {
			entityType: 'MaterializationChild',
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		converted: {
			primitiveType: arktype('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
	})({
		selectors: {
			Slug: ['slug'],
		},
	}),
	entity({
		entityType: 'MaterializationChild',
		labels: {
			singular: 'Materialization child',
			plural: 'Materialization children',
		},
	})({
		id: {
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.One,
		},
		title: {
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		kind: {
			primitiveType: arktype('string'),
			cardinality: EntityFieldCardinality.One,
		},
		$sibling: {
			entityType: 'MaterializationChild',
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	})({
		selectors: {
			Id: ['id'],
		},
		facets: {
			Left: facet({
				path: ['kind'],
				is: 'left',
			})({
				label: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
			}),
			Right: facet({
				path: ['kind'],
				is: 'right',
			})({
				label: {
					primitiveType: arktype('string'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
			}),
		},
	}),
] as const

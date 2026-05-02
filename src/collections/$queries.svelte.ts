// Types/constants
import { useLiveQuery } from '@tanstack/svelte-db'

import { entityCollectionByEntityType, entityFieldCollections } from '$/routes/+layout.svelte'
import { schema } from '$/schema/index.ts'


export const entityQueryByEntityType = Object.fromEntries(
	schema
		.map((entityDefinition) => [
			entityDefinition.entityType,
			useLiveQuery((queryBuilder) => (
				queryBuilder
					.from({ entity: entityCollectionByEntityType[entityDefinition.entityType] })
					.select(({ entity }) => ({ entity }))
			))
		] as const)
)

export const entityFieldQueryByEntityType = Object.fromEntries(
	schema.map((entityDefinition) => [
		entityDefinition.entityType,
		Object.fromEntries(
			entityDefinition.fields
				.filter((field) => entityFieldCollections[entityDefinition.entityType][field.name])
				.map((field) => [
					field.name,
					useLiveQuery((queryBuilder) => (
						queryBuilder
							.from({
								entityField: entityFieldCollections[entityDefinition.entityType][field.name],
							})
							.select(({ entityField }) => ({ entityField }))
					)),
				] as const)
		),
	] as const)
)

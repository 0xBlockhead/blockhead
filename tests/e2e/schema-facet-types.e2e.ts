import { expect, test } from '@playwright/test'

import {
	EntityProxyField,
	type EntityProxyResource,
} from '$/client/$proxy.svelte.ts'
import {
	type EntityFacetFieldName,
	type EntityNonFacetFieldName,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'


const assertNetworkProxyFieldTypes = (
	networkProxy: EntityProxyResource<typeof schema, EntityType.Network>
) => {
	expect(networkProxy.Solana.$$tokenMints.fieldName).toBe('$$tokenMints')
	// @ts-expect-error proxy symbol access is reserved for fields that collide with resource properties.
	networkProxy[EntityProxyField]('$$tokenMints')
	// @ts-expect-error proxy field access must reject removed generated flat facet names.
	networkProxy.Solana.$$solanaTokenMints
}

const assertCollisionProxyFieldTypes = (
	aiDocumentClaimProxy: EntityProxyResource<typeof schema, EntityType.AiDocumentClaim>
) => {
	expect(aiDocumentClaimProxy[EntityProxyField]('value').fieldName).toBe('value')
	// @ts-expect-error direct access resolves the SvelteKit resource value surface, not the schema field.
	aiDocumentClaimProxy.value.fieldName
}

test('schema facet field-name helpers derive canonical Network projection fields', () => {
	const solanaFacetFieldName: EntityFacetFieldName<typeof schema, EntityType.Network, 'Solana'> = '$$blocks'
	const networkBaseFieldName: EntityNonFacetFieldName<typeof schema, EntityType.Network> = 'executionModels'
	// @ts-expect-error removed generated flat facet names must not type-check against projection fields.
	const removedSolanaFacetFieldName: EntityFacetFieldName<typeof schema, EntityType.Network, 'Solana'> = '$$solanaBlocks'

	expect(solanaFacetFieldName).toBe('$$blocks')
	expect(networkBaseFieldName).toBe('executionModels')
	expect(assertNetworkProxyFieldTypes).toBeDefined()
	expect(assertCollisionProxyFieldTypes).toBeDefined()
	expect(removedSolanaFacetFieldName).toBe('$$solanaBlocks')
})

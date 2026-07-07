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
	expect(networkProxy[EntityProxyField]<EntityType.SolanaTokenMint>('$$solanaTokenMints').fieldName).toBe('$$solanaTokenMints')
	// @ts-expect-error proxy field access must reject facet-local APP source names.
	networkProxy[EntityProxyField]<EntityType.SolanaTokenMint>('$$tokenMints')
}

test('schema facet field-name helpers derive generated flat Network fields', () => {
	const solanaFacetFieldName: EntityFacetFieldName<typeof schema, EntityType.Network, 'Solana'> = '$$solanaBlocks'
	const networkBaseFieldName: EntityNonFacetFieldName<typeof schema, EntityType.Network> = 'executionModels'
	// @ts-expect-error facet-local APP names must not type-check against generated flat schema field names.
	const unqualifiedSolanaFacetFieldName: EntityFacetFieldName<typeof schema, EntityType.Network, 'Solana'> = '$$blocks'

	expect(solanaFacetFieldName).toBe('$$solanaBlocks')
	expect(networkBaseFieldName).toBe('executionModels')
	expect(assertNetworkProxyFieldTypes).toBeDefined()
	expect(unqualifiedSolanaFacetFieldName).toBe('$$blocks')
})

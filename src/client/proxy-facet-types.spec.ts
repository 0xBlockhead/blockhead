import { expect, expectTypeOf, it } from 'vitest'
import { EntityType } from '$/schema/EntityType.ts'
import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
import { schema } from '$/schema/index.ts'

it('types nested facet access by entity and facet path', () => {
	type NetworkProxy = EntityProxyResource<typeof schema, EntityType.Network>
	type EvmLogProxy = EntityProxyResource<typeof schema, EntityType.EvmLog>

	expectTypeOf<NetworkProxy['Evm']['$$blocks']>().toMatchTypeOf<object>()
	expectTypeOf<EvmLogProxy['Event']['TokenTransfer']['$$tokenTransfers']>().toMatchTypeOf<object>()
	expect(schema).toBeDefined()
	// @ts-expect-error facet fields are not base entity fields
	type InvalidNetworkField = NetworkProxy['$$blocks']
	// @ts-expect-error nested facet fields are not available on the parent projection
	type InvalidEventField = EvmLogProxy['Event']['$$tokenTransfers']
	// @ts-expect-error unknown facet members are rejected at every nested level
	type InvalidNestedFacetField = EvmLogProxy['Event']['TokenTransfer']['missing']

	expectTypeOf<InvalidNetworkField>().toBeNever()
})

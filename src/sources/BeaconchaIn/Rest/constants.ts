/**
 * Beaconcha.in V1 REST binding lookup by EIP-155 chain id.
 * Locators live on `bindings.ts`; this is the O(1) chain → binding map for queries/resolvers.
 * @see https://docs.beaconcha.in/api/v1-overview
 */

import bindings from '$/sources/BeaconchaIn/bindings.ts'
import { Source } from '$/sources/Source.ts'


// Lookups

export const bindingByChainId = Object.fromEntries(
	bindings[Source.BeaconchaIn_Rest].map((binding) => [
		binding.target.key,
		binding,
	])
)

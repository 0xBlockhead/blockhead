import { describe, expect, it } from 'vitest'

import {
	NetworkNamespace,
	networkByCaip2,
	networkBySlug,
} from '$/constants/Network.ts'

describe('canonical network identities', () => {
	it('indexes Tezos slug and CAIP-2 to one catalog row', () => {
		expect(networkBySlug.tezos).toBe(networkByCaip2['tezos:NetXdQprcVkpaWU'])
		expect(networkBySlug.tezos).toMatchObject({
			slug: 'tezos',
			caip2: {
				namespace: 'tezos',
				reference: 'NetXdQprcVkpaWU',
			},
			namespace: NetworkNamespace.Tezos,
		})
		expect(networkByCaip2['tezos:mainnet']).toBeUndefined()
	})
})

import { expect, it, vi } from 'vitest'

import bindings from '$/sources/AptosIndexer/bindings.ts'
import { Source } from '$/sources/Source.ts'

const queryGraphql = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/Graphql/client.ts', () => ({
	graphql: queryGraphql,
}))

const { executeAptosIndexer } = await import('$/sources/AptosIndexer/Graphql/client.ts')
const binding = bindings[Source.AptosIndexer_Graphql][0]

it('passes only the caller-provided noncanonical binding to GraphQL', async () => {
	const modifiedBinding = {
		...binding,
		endpoints: binding.endpoints.map((endpoint) => ({
			...endpoint,
			locator: 'https://noncanonical.example/aptos-indexer',
		})),
	}
	queryGraphql.mockResolvedValueOnce({ value: true })
	const document = {
		kind: 'Document',
		definitions: [],
	}

	await executeAptosIndexer(modifiedBinding, document, {})

	expect(queryGraphql).toHaveBeenCalledOnce()
	expect(queryGraphql.mock.calls[0][0].binding).toBe(modifiedBinding)
})

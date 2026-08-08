import { expect, it, vi } from 'vitest'

import bindings from '$/sources/Amboss/bindings.ts'
import { Source } from '$/sources/Source.ts'

const queryGraphql = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/Graphql/client.ts', () => ({
	graphql: queryGraphql,
}))

const { graphql, queryAmboss } = await import('$/sources/Amboss/Graphql/client.ts')
const binding = bindings[Source.Amboss_Graphql][0]

it('passes only the caller-provided noncanonical binding to GraphQL', async () => {
	const modifiedBinding = {
		...binding,
		endpoints: binding.endpoints.map((endpoint) => ({
			...endpoint,
			locator: 'https://noncanonical.example/amboss',
		})),
	}
	queryGraphql.mockResolvedValueOnce({ value: true })

	await queryAmboss(modifiedBinding, graphql(`query BindingPurity { __typename }`))

	expect(queryGraphql).toHaveBeenCalledOnce()
	expect(queryGraphql.mock.calls[0][0].binding).toBe(modifiedBinding)
})

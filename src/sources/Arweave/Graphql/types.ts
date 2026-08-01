import type { FragmentOf } from 'gql.tada'

import { graphql } from './client.ts'

export const ArweaveGraphqlTransactionFragment = graphql(`
	fragment ArweaveGraphqlTransaction on Transaction @_unmask {
		id
		anchor
		signature
		recipient
		owner {
			address
			key
		}
		fee {
			winston
		}
		quantity {
			winston
		}
		data {
			size
			type
		}
		tags {
			name
			value
		}
		block {
			id
			timestamp
			height
			previous
		}
	}
`)

export type ArweaveGraphqlTransaction = FragmentOf<typeof ArweaveGraphqlTransactionFragment>

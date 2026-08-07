import type { FragmentOf } from 'gql.tada'

import { graphql } from './client.ts'

export const EnsDomainFragment = graphql(`
	fragment EnsDomain on Domain @_unmask {
		id
		name
		labelName
		labelhash
		parent {
			id
			name
		}
		subdomains {
			id
			name
		}
		resolvedAddress {
			id
		}
		owner {
			id
		}
		registrant {
			id
		}
		wrappedOwner {
			id
		}
		wrappedDomain {
			expiryDate
			fuses
		}
		registration {
			registrationDate
			expiryDate
			cost
			registrant {
				id
			}
		}
		resolver {
			id
			address
			addr {
				id
			}
			contentHash
			texts
			coinTypes
		}
		ttl
		isMigrated
		createdAt
		expiryDate
		subdomainCount
	}
`)

export type EnsSubgraphDomain = FragmentOf<typeof EnsDomainFragment> & {
	resolver?: (
		| NonNullable<FragmentOf<typeof EnsDomainFragment>['resolver']>
		| null
	) & {
		events?: readonly {
			__typename: string
			blockNumber: number
			key?: string
			value?: string | null
			coinType?: unknown
			addr?: string | {
				id: string
			} | null
		}[] | null
	}
}

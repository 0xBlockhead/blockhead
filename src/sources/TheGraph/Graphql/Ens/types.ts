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
			events {
				__typename
				blockNumber
				... on TextChanged {
					key
					value
				}
				... on MulticoinAddrChanged {
					coinType
					addr
				}
				... on AddrChanged {
					addr {
						id
					}
				}
			}
		}
		ttl
		isMigrated
		createdAt
		expiryDate
		subdomainCount
	}
`)

export type EnsSubgraphDomain = FragmentOf<typeof EnsDomainFragment>

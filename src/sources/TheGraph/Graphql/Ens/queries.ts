import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { graphql, queryEns } from '$/sources/TheGraph/Graphql/Ens/client.ts'

const Domain = graphql(`
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

export const getEnsName = async ({
	publicEnv,
	name,
}: {
	publicEnv: SourcePublicEnvFor<Source.TheGraph_Graphql>
	name: string
}) => (
	(
		await queryEns(
			publicEnv,
			graphql(`
				query EnsName(
					$name: String!
				) {
					domains(
						where: {
							name: $name
						}
					) {
						...EnsDomain
					}
				}
			`, [
				Domain,
			]),
			{
				name,
			},
		)
	).domains
)

export const getEnsDomainsContaining = async ({
	publicEnv,
	query,
}: {
	publicEnv: SourcePublicEnvFor<Source.TheGraph_Graphql>
	query: string
}) => (
	(
		await queryEns(
			publicEnv,
			graphql(`
				query EnsDomainsContaining(
					$query: String!
				) {
					domains(
						where: {
							name_contains: $query
							name_not: $query
						}
						orderBy: name
						orderDirection: asc
					) {
						...EnsDomain
					}
				}
			`, [
				Domain,
			]),
			{
				query,
			},
		)
	).domains
)

export const getEnsDomainsByOwner = async ({
	publicEnv,
	owner,
}: {
	publicEnv: SourcePublicEnvFor<Source.TheGraph_Graphql>
	owner: string
}) => (
	(
		await queryEns(
			publicEnv,
			graphql(`
				query EnsDomainsByOwner(
					$owner: String!
				) {
					domains(
						where: {
							owner: $owner
						}
						orderBy: expiryDate
						orderDirection: desc
					) {
						...EnsDomain
					}
				}
			`, [
				Domain,
			]),
			{
				owner,
			},
		)
	).domains
)

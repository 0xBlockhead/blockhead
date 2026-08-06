import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { graphql, queryEns } from '$/sources/TheGraph/Graphql/Ens/client.ts'
import { EnsDomainFragment } from '$/sources/TheGraph/Graphql/Ens/types.ts'

export const getEnsSubgraphReachability = async ({
	publicEnv,
}: {
	publicEnv: SourcePublicEnv
}) => {
	await queryEns(
		publicEnv,
		graphql(`
			query EnsSubgraphReachability {
				domains(
					first: 1
				) {
					id
				}
			}
		`)
	)

	return true
}

export const getName = async ({
	publicEnv,
	name,
}: {
	publicEnv: SourcePublicEnv
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
				EnsDomainFragment,
			]),
			{
				name,
			}
		)
	).domains
)

export const getDomainsContaining = async ({
	publicEnv,
	query,
	limit,
}: {
	publicEnv: SourcePublicEnv
	query: string
	limit: number
}) => (
	(
		await queryEns(
			publicEnv,
			graphql(`
				query EnsDomainsContaining(
					$query: String!
					$limit: Int!
				) {
					domains(
						where: {
							name_contains: $query
						}
						orderBy: name
						orderDirection: asc
						first: $limit
					) {
						...EnsDomain
					}
				}
			`, [
				EnsDomainFragment,
			]),
			{
				query,
				limit,
			}
		)
	).domains
)

export const getDomainsByOwner = async ({
	publicEnv,
	owner,
}: {
	publicEnv: SourcePublicEnv
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
				EnsDomainFragment,
			]),
			{
				owner,
			}
		)
	).domains
)

/** Domains whose resolver `addr` / resolvedAddress points at this account (forward reverse-lookup). */
export const getDomainsByResolvedAddress = async ({
	publicEnv,
	resolvedAddress,
}: {
	publicEnv: SourcePublicEnv
	resolvedAddress: string
}) => (
	(
		await queryEns(
			publicEnv,
			graphql(`
				query EnsDomainsByResolvedAddress(
					$resolvedAddress: String!
				) {
					domains(
						where: {
							resolvedAddress: $resolvedAddress
						}
						orderBy: createdAt
						orderDirection: asc
					) {
						...EnsDomain
					}
				}
			`, [
				EnsDomainFragment,
			]),
			{
				resolvedAddress,
			}
		)
	).domains
)

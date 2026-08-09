import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { graphql, queryEns as executeEnsQuery } from '$/sources/TheGraph/Graphql/Ens/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	EnsDomainFragment,
	type EnsSubgraphDomain,
} from '$/sources/TheGraph/Graphql/Ens/types.ts'

/** Graph Node default page is 100; tip text/coin values need a larger ordered window. */
const resolverTipEventPageSize = 1000

export const ensQueries = (binding: SourceBinding) => {
	const queryEns = <_Result extends object, _Variables extends object>(
		publicEnv: SourcePublicEnv,
		document: Parameters<typeof executeEnsQuery<_Result, _Variables>>[2],
		variables?: _Variables
	) => executeEnsQuery(binding, publicEnv, document, variables)

	const getEnsSubgraphReachability = async ({
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

const hydrateResolverTipEvents = async ({
	publicEnv,
	domain,
}: {
	publicEnv: SourcePublicEnv
	domain: EnsSubgraphDomain
}): Promise<EnsSubgraphDomain> => {
	const resolver = domain.resolver
	if (resolver?.id == null)
		return domain

	const tipEvents = await queryEns(
		publicEnv,
		graphql(`
			query EnsResolverTipEvents(
				$resolver: String!
				$first: Int!
			) {
				textChangeds(
					where: {
						resolver: $resolver
					}
					orderBy: blockNumber
					orderDirection: desc
					first: $first
				) {
					__typename
					blockNumber
					key
					value
				}
				multicoinAddrChangeds(
					where: {
						resolver: $resolver
					}
					orderBy: blockNumber
					orderDirection: desc
					first: $first
				) {
					__typename
					blockNumber
					coinType
					addr
				}
				addrChangeds(
					where: {
						resolver: $resolver
					}
					orderBy: blockNumber
					orderDirection: desc
					first: $first
				) {
					__typename
					blockNumber
					addr {
						id
					}
				}
			}
		`),
		{
			resolver: resolver.id,
			first: resolverTipEventPageSize,
		}
	)

	return {
		...domain,
		resolver: {
			...resolver,
			events: [
				...tipEvents.textChangeds,
				...tipEvents.multicoinAddrChangeds,
				...tipEvents.addrChangeds,
			],
		},
	}
}

	const getName = async ({
	publicEnv,
	name,
}: {
	publicEnv: SourcePublicEnv
	name: string
}) => (
	await Promise.all(
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
		).domains.map((domain) => (
			hydrateResolverTipEvents({
				publicEnv,
				domain,
			})
		))
	)
)

	const getDomainsContaining = async ({
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

	const getDomainsByOwner = async ({
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
	const getDomainsByResolvedAddress = async ({
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

	return {
		getDomainsByOwner,
		getDomainsByResolvedAddress,
		getDomainsContaining,
		getEnsSubgraphReachability,
		getName,
	}
}

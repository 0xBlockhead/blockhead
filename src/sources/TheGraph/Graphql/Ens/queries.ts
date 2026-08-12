import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import bindings from '$/sources/TheGraph/bindings.ts'
import { graphql, queryEns as executeEnsQuery } from '$/sources/TheGraph/Graphql/Ens/client.ts'
import { Source } from '$/sources/Source.ts'
import {
	EnsDomainFragment,
	type EnsSubgraphDomain,
} from '$/sources/TheGraph/Graphql/Ens/types.ts'
import { normalize as ensNormalizeNode, toString as ensToString } from '@tevm/voltaire/Ens'

/** Graph Node default page is 100; tip text/coin values need a larger ordered window. */
const resolverTipEventPageSize = 1000

export const ensQueries = (() => {
	const binding = bindings[Source.TheGraph_Graphql][0]
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
	// oxlint-disable-next-line typescript/no-unnecessary-condition -- GraphQL may return a null resolver despite generated type.
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

	const getReverseRecord = async ({
		publicEnv,
		name,
		accountAddress,
	}: {
		publicEnv: SourcePublicEnv
		name: string
		accountAddress: string
	}) => {
		const normalizedAddress = hexLowerOfByteSize(accountAddress, 20)
		if (normalizedAddress == null)
			throw new Error('TheGraph_Graphql: reverse record requires a 20-byte EVM address')

		const normalizedName = ensToString(ensNormalizeNode(name))
		const reverseName = `${normalizedAddress.slice(2)}.addr.reverse`
		const [
			forwardDomains,
			reverseDomains,
		] = await Promise.all([
			getName({
				publicEnv,
				name: normalizedName,
			}),
			getName({
				publicEnv,
				name: reverseName,
			}),
		])

		return {
			forward: forwardDomains.find((domain) => domain.name === normalizedName),
			reverse: reverseDomains.find((domain) => domain.name === reverseName),
		}
	}

	return {
		getDomainsByOwner,
		getDomainsByResolvedAddress,
		getDomainsContaining,
		getEnsSubgraphReachability,
		getName,
		getReverseRecord,
	}
})()

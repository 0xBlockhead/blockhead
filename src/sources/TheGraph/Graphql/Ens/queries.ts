import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { graphql, queryEns } from '$/sources/TheGraph/Graphql/Ens/client.ts'
import { EnsDomainFragment } from '$/sources/TheGraph/Graphql/Ens/types.ts'

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
				EnsDomainFragment,
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
	limit,
}: {
	publicEnv: SourcePublicEnvFor<Source.TheGraph_Graphql>
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
				EnsDomainFragment,
			]),
			{
				owner,
			},
		)
	).domains
)

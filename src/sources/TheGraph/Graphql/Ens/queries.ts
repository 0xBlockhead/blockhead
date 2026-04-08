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
			texts
			coinTypes
		}
		ttl
		isMigrated
		createdAt
		expiryDate
	}
`)

export const getEnsName = async ({
	name,
}: {
	name: string
}) => (
	(
		await queryEns(
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
	query,
}: {
	query: string
}) => (
	(
		await queryEns(
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
	owner,
}: {
	owner: string
}) => (
	(
		await queryEns(
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

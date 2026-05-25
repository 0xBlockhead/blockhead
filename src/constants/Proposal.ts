// Types
import { isJsonObject, type JsonValue } from '$/typescript/JsonValue.ts'

export enum ProposalRealm {
	ChainAgnostic = 'ChainAgnostic',
	Ens = 'Ens',
	Ethereum = 'Ethereum',
}

export enum ProposalCategory {
	Caip = 'Caip',
	Eip = 'Eip',
	Erc = 'Erc',
	Ensip = 'Ensip',
}

export type ProposalKindId = {
	realm: ProposalRealm
	category: ProposalCategory
}


// Constants
export const proposalRealms = [
	{
		id: ProposalRealm.Ethereum,
		label: 'Ethereum',
		labelPlural: null,
		slug: 'ethereum',
	},
	{
		id: ProposalRealm.Ens,
		label: 'ENS',
		labelPlural: null,
		slug: 'ens',
	},
	{
		id: ProposalRealm.ChainAgnostic,
		label: 'Chain Agnostic',
		labelPlural: 'CAIPs',
		slug: 'chain-agnostic',
	},
] as const satisfies readonly {
	id: ProposalRealm
	label: string
	labelPlural: string | null
	slug: string
}[]

export const proposalCategories = [
	{
		id: ProposalCategory.Caip,
		label: 'CAIP',
		labelPlural: 'CAIPs',
		slug: 'caip',
	},
	{
		id: ProposalCategory.Eip,
		label: 'EIP',
		labelPlural: 'EIPs',
		slug: 'eip',
	},
	{
		id: ProposalCategory.Erc,
		label: 'ERC',
		labelPlural: 'ERCs',
		slug: 'erc',
	},
	{
		id: ProposalCategory.Ensip,
		label: 'ENSIP',
		labelPlural: 'ENSIPs',
		slug: 'ensip',
	},
] as const satisfies readonly {
	id: ProposalCategory
	label: string
	labelPlural: string
	slug: string
}[]

type ProposalRealmRow = (typeof proposalRealms)[number]

type ProposalCategoryRow = (typeof proposalCategories)[number]


// Lookups
export const proposalRealmById = Object.fromEntries(
	proposalRealms
		.map((row) => [
			row.id,
			row,
		]),
)

export const proposalRealmBySlug = Object.fromEntries(
	proposalRealms
		.map((row) => [
			row.slug,
			row,
		]),
)

export const proposalCategoryById = Object.fromEntries(
	proposalCategories
		.map((row) => [
			row.id,
			row,
		]),
)

export const proposalCategoryBySlug = Object.fromEntries(
	proposalCategories
		.map((row) => [
			row.slug,
			row,
		]),
)

const isProposalRealm = (value: string): value is ProposalRealm => (
	value in proposalRealmById
)

const isProposalCategory = (value: string): value is ProposalCategory => (
	value in proposalCategoryById
)

export const proposalKindIds = proposalRealms
	.flatMap((realmRow) => (
		proposalCategories
			.filter((categoryRow) => (
				(
					realmRow.id === ProposalRealm.Ethereum
					&& (
						categoryRow.id === ProposalCategory.Eip
						|| categoryRow.id === ProposalCategory.Erc
					)
				)
				|| (
					realmRow.id === ProposalRealm.Ens
					&& categoryRow.id === ProposalCategory.Ensip
				)
				|| (
					realmRow.id === ProposalRealm.ChainAgnostic
					&& categoryRow.id === ProposalCategory.Caip
				)
			))
			.map((categoryRow) => ({
				realm: realmRow.id,
				category: categoryRow.id,
			}))
	))
	.sort((firstKind, secondKind) => (
		firstKind.realm.localeCompare(secondKind.realm) || firstKind.category.localeCompare(secondKind.category)
	))

export const proposalKindAllowedInRealmByKey = Object.fromEntries(
	proposalKindIds.map((proposalKindId) => [
		`${proposalKindId.realm}:${proposalKindId.category}`,
		proposalKindId,
	]),
)

const proposalWireParts = (wire: JsonValue): {
	realm: ProposalRealm
	category: ProposalCategory
	number: number
} | null => {
	if (!isJsonObject(wire)) return null
	const { realm, category, number } = wire
	if (
		typeof realm !== 'string' || !isProposalRealm(realm)
		|| typeof category !== 'string' || !isProposalCategory(category)
		|| typeof number !== 'number' || !Number.isFinite(number)
	) return null
	if (proposalKindAllowedInRealmByKey[`${realm}:${category}`] == null) return null
	return {
		realm,
		category,
		number,
	}
}

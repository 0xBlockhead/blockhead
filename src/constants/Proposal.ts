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
export const proposalRealmById: Record<ProposalRealm, ProposalRealmRow> = Object.fromEntries(
	proposalRealms
		.map((row) => [
			row.id,
			row,
		]),
)

export const proposalRealmBySlug: Record<string, ProposalRealmRow> = Object.fromEntries(
	proposalRealms
		.map((row) => [
			row.slug,
			row,
		]),
)

export const proposalCategoryById: Record<ProposalCategory, ProposalCategoryRow> = Object.fromEntries(
	proposalCategories
		.map((row) => [
			row.id,
			row,
		]),
)

export const proposalCategoryBySlug: Record<string, ProposalCategoryRow> = Object.fromEntries(
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

export const proposalKindAllowedInRealm = (realm: ProposalRealm, category: ProposalCategory) => (
	(
		realm === ProposalRealm.Ethereum
		&& (category === ProposalCategory.Eip || category === ProposalCategory.Erc)
	)
	|| (
		realm === ProposalRealm.Ens
		&& category === ProposalCategory.Ensip
	)
	|| (
		realm === ProposalRealm.ChainAgnostic
		&& category === ProposalCategory.Caip
	)
)

export const proposalKindIds = proposalRealms
	.flatMap((realmRow) => (
		proposalCategories
			.filter((categoryRow) => (
				proposalKindAllowedInRealm(
					realmRow.id,
					categoryRow.id,
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

export const proposalKindIdsForRealm = (realm: ProposalRealm) => (
	proposalKindIds.filter((kind) => kind.realm === realm)
)

export const proposalWireParts = (wire: JsonValue): {
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
	if (!proposalKindAllowedInRealm(realm, category)) return null
	return {
		realm,
		category,
		number,
	}
}

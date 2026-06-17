// Types
export enum SpecificationRealm {
	Bitcoin = 'Bitcoin',
	BitcoinCash = 'BitcoinCash',
	ChainAgnostic = 'ChainAgnostic',
	Cosmos = 'Cosmos',
	Dogecoin = 'Dogecoin',
	Ens = 'Ens',
	Ethereum = 'Ethereum',
	Filecoin = 'Filecoin',
	Hyperliquid = 'Hyperliquid',
	Litecoin = 'Litecoin',
	Near = 'Near',
	Polkadot = 'Polkadot',
	Quilibrium = 'Quilibrium',
	Solana = 'Solana',
	Zcash = 'Zcash',
}

export enum ProposalCategory {
	Adr = 'Adr',
	Bip = 'Bip',
	Chip = 'Chip',
	Caip = 'Caip',
	Dip = 'Dip',
	Eip = 'Eip',
	Erc = 'Erc',
	Ensip = 'Ensip',
	Fip = 'Fip',
	Hip = 'Hip',
	Lip = 'Lip',
	Nep = 'Nep',
	ProtocolDocument = 'ProtocolDocument',
	Rfc = 'Rfc',
	Simd = 'Simd',
	Zip = 'Zip',
}

export type ProposalKindId = {
	realm: SpecificationRealm
	category: ProposalCategory
}


// Constants
export const specificationRealms = [
	{
		id: SpecificationRealm.Bitcoin,
		label: 'Bitcoin',
		labelPlural: 'BIPs',
		slug: 'bitcoin',
	},
	{
		id: SpecificationRealm.BitcoinCash,
		label: 'Bitcoin Cash',
		labelPlural: 'CHIPs',
		slug: 'bitcoin-cash',
	},
	{
		id: SpecificationRealm.Ethereum,
		label: 'Ethereum',
		labelPlural: null,
		slug: 'ethereum',
	},
	{
		id: SpecificationRealm.Ens,
		label: 'ENS',
		labelPlural: null,
		slug: 'ens',
	},
	{
		id: SpecificationRealm.ChainAgnostic,
		label: 'Chain Agnostic',
		labelPlural: 'CAIPs',
		slug: 'chain-agnostic',
	},
	{
		id: SpecificationRealm.Cosmos,
		label: 'Cosmos',
		labelPlural: 'ADRs',
		slug: 'cosmos',
	},
	{
		id: SpecificationRealm.Dogecoin,
		label: 'Dogecoin',
		labelPlural: 'DIPs',
		slug: 'dogecoin',
	},
	{
		id: SpecificationRealm.Filecoin,
		label: 'Filecoin',
		labelPlural: 'FIPs',
		slug: 'filecoin',
	},
	{
		id: SpecificationRealm.Hyperliquid,
		label: 'Hyperliquid',
		labelPlural: 'HIPs',
		slug: 'hyperliquid',
	},
	{
		id: SpecificationRealm.Litecoin,
		label: 'Litecoin',
		labelPlural: 'LIPs',
		slug: 'litecoin',
	},
	{
		id: SpecificationRealm.Near,
		label: 'NEAR',
		labelPlural: 'NEPs',
		slug: 'near',
	},
	{
		id: SpecificationRealm.Polkadot,
		label: 'Polkadot',
		labelPlural: 'RFCs',
		slug: 'polkadot',
	},
	{
		id: SpecificationRealm.Quilibrium,
		label: 'Quilibrium',
		labelPlural: 'Protocol documents',
		slug: 'quilibrium',
	},
	{
		id: SpecificationRealm.Solana,
		label: 'Solana',
		labelPlural: 'SIMDs',
		slug: 'solana',
	},
	{
		id: SpecificationRealm.Zcash,
		label: 'Zcash',
		labelPlural: 'ZIPs',
		slug: 'zcash',
	},
] as const satisfies readonly {
	id: SpecificationRealm
	label: string
	labelPlural: string | null
	slug: string
}[]

export const proposalCategories = [
	{
		id: ProposalCategory.Adr,
		label: 'ADR',
		labelPlural: 'ADRs',
		slug: 'adr',
	},
	{
		id: ProposalCategory.Bip,
		label: 'BIP',
		labelPlural: 'BIPs',
		slug: 'bip',
	},
	{
		id: ProposalCategory.Chip,
		label: 'CHIP',
		labelPlural: 'CHIPs',
		slug: 'chip',
	},
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
	{
		id: ProposalCategory.Dip,
		label: 'DIP',
		labelPlural: 'DIPs',
		slug: 'dip',
	},
	{
		id: ProposalCategory.Fip,
		label: 'FIP',
		labelPlural: 'FIPs',
		slug: 'fip',
	},
	{
		id: ProposalCategory.Hip,
		label: 'HIP',
		labelPlural: 'HIPs',
		slug: 'hip',
	},
	{
		id: ProposalCategory.Lip,
		label: 'LIP',
		labelPlural: 'LIPs',
		slug: 'lip',
	},
	{
		id: ProposalCategory.Nep,
		label: 'NEP',
		labelPlural: 'NEPs',
		slug: 'nep',
	},
	{
		id: ProposalCategory.ProtocolDocument,
		label: 'Protocol document',
		labelPlural: 'Protocol documents',
		slug: 'protocol-document',
	},
	{
		id: ProposalCategory.Rfc,
		label: 'RFC',
		labelPlural: 'RFCs',
		slug: 'rfc',
	},
	{
		id: ProposalCategory.Simd,
		label: 'SIMD',
		labelPlural: 'SIMDs',
		slug: 'simd',
	},
	{
		id: ProposalCategory.Zip,
		label: 'ZIP',
		labelPlural: 'ZIPs',
		slug: 'zip',
	},
] as const satisfies readonly {
	id: ProposalCategory
	label: string
	labelPlural: string
	slug: string
}[]


// Lookups
export const specificationRealmById = Object.fromEntries(
	specificationRealms
		.map((row) => [
			row.id,
			row,
		])
)

export const specificationRealmBySlug = Object.fromEntries(
	specificationRealms
		.map((row) => [
			row.slug,
			row,
		])
)

export const proposalCategoryById = Object.fromEntries(
	proposalCategories
		.map((row) => [
			row.id,
			row,
		])
)

export const proposalCategoryBySlug = Object.fromEntries(
	proposalCategories
		.map((row) => [
			row.slug,
			row,
		])
)

export const proposalKinds = specificationRealms
	.flatMap((realmRow) => (
		proposalCategories
			.filter((categoryRow) => (
				(
					realmRow.id === SpecificationRealm.Ethereum
					&& (
						categoryRow.id === ProposalCategory.Eip
						|| categoryRow.id === ProposalCategory.Erc
					)
				)
				|| (
					realmRow.id === SpecificationRealm.Ens
					&& categoryRow.id === ProposalCategory.Ensip
				)
				|| (
					realmRow.id === SpecificationRealm.ChainAgnostic
					&& categoryRow.id === ProposalCategory.Caip
				)
				|| (
					realmRow.id === SpecificationRealm.Bitcoin
					&& categoryRow.id === ProposalCategory.Bip
				)
				|| (
					realmRow.id === SpecificationRealm.Zcash
					&& categoryRow.id === ProposalCategory.Zip
				)
				|| (
					realmRow.id === SpecificationRealm.Filecoin
					&& categoryRow.id === ProposalCategory.Fip
				)
				|| (
					realmRow.id === SpecificationRealm.Solana
					&& categoryRow.id === ProposalCategory.Simd
				)
				|| (
					realmRow.id === SpecificationRealm.Hyperliquid
					&& categoryRow.id === ProposalCategory.Hip
				)
				|| (
					realmRow.id === SpecificationRealm.Cosmos
					&& categoryRow.id === ProposalCategory.Adr
				)
				|| (
					realmRow.id === SpecificationRealm.Polkadot
					&& categoryRow.id === ProposalCategory.Rfc
				)
				|| (
					realmRow.id === SpecificationRealm.Near
					&& categoryRow.id === ProposalCategory.Nep
				)
				|| (
					realmRow.id === SpecificationRealm.Litecoin
					&& categoryRow.id === ProposalCategory.Lip
				)
				|| (
					realmRow.id === SpecificationRealm.Dogecoin
					&& categoryRow.id === ProposalCategory.Dip
				)
				|| (
					realmRow.id === SpecificationRealm.BitcoinCash
					&& categoryRow.id === ProposalCategory.Chip
				)
				|| (
					realmRow.id === SpecificationRealm.Quilibrium
					&& categoryRow.id === ProposalCategory.ProtocolDocument
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
	proposalKinds.map((proposalKind) => [
		`${proposalKind.realm}:${proposalKind.category}`,
		proposalKind,
	])
)

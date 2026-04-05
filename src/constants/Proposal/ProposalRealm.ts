// Constants
export enum ProposalRealm {
	ChainAgnostic = 'chain-agnostic',
	Ens = 'ens',
	Ethereum = 'ethereum',
}

export const proposalRealms = [
	{
		id: ProposalRealm.ChainAgnostic,
		label: 'Chain Agnostic',
		slug: 'chain-agnostic',
	},
	{
		id: ProposalRealm.Ens,
		label: 'ENS',
		slug: 'ens',
	},
	{
		id: ProposalRealm.Ethereum,
		label: 'Ethereum',
		slug: 'ethereum',
	},
] as const satisfies readonly {
	id: ProposalRealm
	label: string
	slug: string
}[]

type ProposalRealmRow = (typeof proposalRealms)[number]


// Functions
export const proposalRealmFromRouteParam = (param: string | undefined): ProposalRealm | null => (
	param != null && param !== '' ?
		proposalRealmBySlug[param]?.id ?? null
	:	null
)


// Lookups
export const proposalRealmById = Object.fromEntries(
	proposalRealms
		.map((proposalRealm) => [
			proposalRealm.id,
			proposalRealm,
		]),
) as Record<ProposalRealm, ProposalRealmRow>

export const proposalRealmBySlug = Object.fromEntries(
	proposalRealms
		.map((proposalRealm) => [
			proposalRealm.slug,
			proposalRealm,
		]),
) as Record<string, ProposalRealmRow>

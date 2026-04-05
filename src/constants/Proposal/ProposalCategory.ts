// Constants
export enum ProposalCategory {
	Eip = 'Eip',
	Erc = 'Erc',
	Ensip = 'Ensip',
}

export const proposalCategories = [
	{
		id: ProposalCategory.Eip,
		label: 'EIP',
		slug: 'eip',
	},
	{
		id: ProposalCategory.Erc,
		label: 'ERC',
		slug: 'erc',
	},
	{
		id: ProposalCategory.Ensip,
		label: 'ENSIP',
		slug: 'ensip',
	},
] as const satisfies readonly {
	id: ProposalCategory
	label: string
	slug: string
}[]

type ProposalCategoryRow = (typeof proposalCategories)[number]

export const proposalCategoryById = Object.fromEntries(
	proposalCategories
		.map((proposalCategory) => [
			proposalCategory.id,
			proposalCategory,
		]),
) as Record<ProposalCategory, ProposalCategoryRow>

export const proposalCategoryBySlug = Object.fromEntries(
	proposalCategories
		.map((proposalCategory) => [
			proposalCategory.slug,
			proposalCategory,
		]),
) as Record<string, ProposalCategoryRow>

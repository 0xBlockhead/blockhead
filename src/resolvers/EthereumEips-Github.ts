import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { parseFrontmatter, stripFrontmatter } from '$/lib/markdownFrontmatter.ts'
import { regex } from 'arkregex'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import defineSpecificationProposalResolvers, {
	specificationProposalIndexPage,
	specificationProposalIndexRows,
} from '$/resolvers/SpecificationProposal.ts'


const ethereumProposalMarkdownBody = (
	text: string,
	markdownPageUrl: string
) => {
	return stripFrontmatter(text)
		.replace(
			/\]\((?:\.\/)?(eip|erc)-(\d+)\.md(#[^)]+)?\)/g,
			(_match, linkLedger: 'eip' | 'erc', number: string, hash: string | undefined) => (
				`](/proposals/ethereum/${linkLedger}/${linkLedger}-${number}${hash ?? ''})`
			)
		)
		.replace(
			/\]\(\.\.\/LICENSE\.md(#[^)]+)?\)/g,
			(_match, hash: string | undefined) => (
				`](${new URL('../LICENSE.md', markdownPageUrl).href}${hash ?? ''})`
			)
		)
		.replace(
			/\]\((?![a-z][a-z0-9+.-]*:|\/|#)([^)\s]+)(#[^)]+)?\)/gi,
			(_match, href: string, hash: string | undefined) => (
				`](${new URL(href, markdownPageUrl).href}${hash ?? ''})`
			)
		)
}

const ethereumProposalIndexFromGithubSpecs = async ({
	category,
	getContents,
}: {
	category?: typeof ProposalCategory.Eip
	| typeof ProposalCategory.Erc
	getContents: (input: { ledger: 'eip' | 'erc' }) => Promise<{
		type: string
		name: string
		download_url?: string | null
	}[]>
}) => {
	const ledgers = (
		category === ProposalCategory.Erc ?
			[{ ledger: 'erc', category: ProposalCategory.Erc }] as const
		: category === ProposalCategory.Eip ?
			[{ ledger: 'eip', category: ProposalCategory.Eip }] as const
		:
			[
				{ ledger: 'eip', category: ProposalCategory.Eip },
				{ ledger: 'erc', category: ProposalCategory.Erc },
			] as const
	)
	const byLedger = await Promise.all(
		ledgers.map(async ({ ledger, category: proposalCategory }) => ({
			ledger,
			category: proposalCategory,
			data: await getContents({ ledger }),
		}))
	)

	return specificationProposalIndexRows(
		byLedger.flatMap(({ ledger, category: proposalCategory, data }) => (
			data.flatMap((githubContent) => {
				if (githubContent.type !== 'file' || !githubContent.name.endsWith('.md'))
					return []

				const proposalNumberRaw = regex(`^${ledger}-(?<proposalNumber>\\d+)\\.md$`).exec(githubContent.name)?.groups.proposalNumber
				return proposalNumberRaw == null ?
					[]
				:
					[{
						[EntityMetaKey.Selector]: {
							realm: SpecificationRealm.Ethereum,
							category: proposalCategory,
							number: parseInt(proposalNumberRaw, 10),
						},
					}]
			})
		)),
		'EthereumEips_Github'
	)
}

export default {
	source: Source.EthereumEips_Github,

	resolvers: [
		...defineSpecificationProposalResolvers({
			appliesTo: [
				{
					realm: SpecificationRealm.Ethereum,
					category: ProposalCategory.Eip,
				},
				{
					realm: SpecificationRealm.Ethereum,
					category: ProposalCategory.Erc,
				},
			],
			resolveProposal: async ({ category, number, realm }) => {
				const {
					getProposalMarkdownPageUrl,
					getProposalMarkdownText,
				} = await import('$/sources/EthereumEips/Github/queries.ts')

				if (
					realm !== SpecificationRealm.Ethereum
					|| (category !== ProposalCategory.Eip && category !== ProposalCategory.Erc)
				)
					throw new Error('EthereumEips_Github: proposal resolver only supports Ethereum EIPs/ERCs')

				const text = await getProposalMarkdownText({
					ledger: category === ProposalCategory.Erc ? 'erc' : 'eip',
					number,
				})
				if (text.trim() === '')
					throw new Error('EthereumEips_Github: empty proposal markdown')

				const body = ethereumProposalMarkdownBody(
					text,
					getProposalMarkdownPageUrl({
						ledger: category === ProposalCategory.Erc ? 'erc' : 'eip',
						number,
					})
				)
				const frontmatter = parseFrontmatter(text)
				return {
					documentCategory: frontmatter.category?.trim() || undefined,
					documentTitle: frontmatter.title?.trim() || undefined,
					documentStatus: frontmatter.status?.trim() || undefined,
					documentBody: body.length > 0 ? body : undefined,
				}
			},
			resolveProposalIndex: async () => {
				const { getContents } = await import('$/sources/EthereumEips/Github/queries.ts')
				return ethereumProposalIndexFromGithubSpecs({
					getContents: ({ ledger }) => getContents({
						ledger,
					}),
				})
			},
		}),

		defineResolver({
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				RealmCategory: {
					resolve: async ({ category, realm }, context) => {
						const { getContents } = await import('$/sources/EthereumEips/Github/queries.ts')
						if (
							realm !== SpecificationRealm.Ethereum
							|| (category !== ProposalCategory.Eip && category !== ProposalCategory.Erc)
						)
							throw new Error('EthereumEips_Github: proposal kind resolver only supports Ethereum EIPs/ERCs')

						return specificationProposalIndexPage(
							await ethereumProposalIndexFromGithubSpecs({
								category,
								getContents: ({ ledger }) => getContents({
									ledger,
								}),
							}),
							context,
							'EthereumEips_Github'
						)
					},
				},
			},
		})({
			$$proposals: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.totalCount,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule

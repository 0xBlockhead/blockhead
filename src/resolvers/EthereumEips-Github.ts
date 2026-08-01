import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import {
	defineResolver,
	type SourceResolverContext,
} from '$/resolvers/defineResolver.ts'
import {
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { parseFrontmatter, stripFrontmatter } from '$/lib/markdownFrontmatter.ts'
import { regex } from 'arkregex'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
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

const ethereumEipErcProposalRowsFromGithubSpecs = async ({
	category,
	getContents,
	context,
}: {
	category?: typeof ProposalCategory.Eip
	| typeof ProposalCategory.Erc
	getContents: (input: { ledger: 'eip' | 'erc' }) => Promise<{
		type: string
		name: string
		download_url?: string | null
	}[]>
	context: SourceResolverContext<Source.EthereumEips_Github>
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
		ledgers.map(async ({ ledger, category: cat }) => ({
			ledger,
			category: cat,
			data: await getContents({ ledger }),
		}))
	)
	const specificationProposals = [] as {
		[EntityMetaKey.Selector]: {
			realm: typeof SpecificationRealm.Ethereum
			category: typeof ProposalCategory.Eip | typeof ProposalCategory.Erc
			number: number
		}
	}[]
	for (const { ledger, category: cat, data } of byLedger) {
		for (const githubContent of data) {
			if (githubContent.type !== 'file' || !githubContent.name.endsWith('.md')) continue
				const proposalNumberRaw = regex(`^${ledger}-(?<proposalNumber>\\d+)\\.md$`).exec(githubContent.name)?.groups.proposalNumber
				const proposalNumber = proposalNumberRaw != null ?
					parseInt(proposalNumberRaw, 10)
				:
					null

				if (proposalNumber == null) continue

				specificationProposals.push({
					[EntityMetaKey.Selector]: {
						realm: SpecificationRealm.Ethereum,
						category: cat,
						number: proposalNumber,
					},
				})
			}
	}
	const sortedProposals = specificationProposals
		.toSorted((left, right) => left[EntityMetaKey.Selector].number - right[EntityMetaKey.Selector].number)
	const offset = context.pagination.offset ?? 0

	return {
		rows: sortedProposals.slice(offset, offset + resolverContextRowLimit(context)),
		totalCount: sortedProposals.length,
	}
}

export default {
	source: Source.EthereumEips_Github,

	resolvers: [
		defineResolver(Source.EthereumEips_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				RealmCategoryNumber: {
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
					resolve: async ({ category, number, realm }) => {
						const {
							getProposalMarkdownPageUrl,
							getProposalMarkdownText,
						} = await import('$/sources/EthereumEips/Github/queries.ts')

						if (
							realm !== SpecificationRealm.Ethereum
							|| (category !== ProposalCategory.Eip && category !== ProposalCategory.Erc)
						) {
							throw new Error('EthereumEips_Github: proposal resolver only supports Ethereum EIPs/ERCs')
						}
						const text = await getProposalMarkdownText({
							ledger: category === ProposalCategory.Erc ? 'erc' : 'eip',
							number,
						})
						if (text.trim() === '') throw new Error('EthereumEips_Github: empty proposal markdown')
						const body = ethereumProposalMarkdownBody(
							text,
							getProposalMarkdownPageUrl({
								ledger: category === ProposalCategory.Erc ? 'erc' : 'eip',
								number,
							})
						)
						const fm = parseFrontmatter(text)
						return {
							documentCategory: fm.category?.trim() || undefined,
							documentTitle: fm.title?.trim() || undefined,
							documentStatus: fm.status?.trim() || undefined,
							documentBody: body.length > 0 ? body : undefined,
						}
					}
				},
			},
		})({
			documentCategory: (snapshot) => snapshot.documentCategory,
			documentTitle: (snapshot) => snapshot.documentTitle,
			documentStatus: (snapshot) => snapshot.documentStatus,
			documentBody: (snapshot) => snapshot.documentBody,
		}),

		defineResolver(Source.EthereumEips_Github, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_selector, context) => {
					const { getContents } = await import('$/sources/EthereumEips/Github/queries.ts')
					return ethereumEipErcProposalRowsFromGithubSpecs({
						getContents: ({ ledger }) => getContents({
							ledger,
						}),
						context,
					})
				},
				}
			}
		})({
			$$proposals: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.totalCount,
			},
		}),

		defineResolver(Source.EthereumEips_Github, {
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				RealmCategory: {
					resolve: async ({ category, realm }, context) => {
						const { getContents } = await import('$/sources/EthereumEips/Github/queries.ts')
						if (
							realm !== SpecificationRealm.Ethereum
							|| (category !== ProposalCategory.Eip && category !== ProposalCategory.Erc)
						) {
							throw new Error('EthereumEips_Github: proposal kind resolver only supports Ethereum EIPs/ERCs')
						}
						return ethereumEipErcProposalRowsFromGithubSpecs({
							category,
							getContents: ({ ledger }) => getContents({
								ledger,
							}),
							context,
						})
					},
				}
			}
		})({
				$$proposals: {
					select: (snapshot) => snapshot.rows,
					resolveCount: (snapshot) => snapshot.totalCount,
				},
			}),
	],
}

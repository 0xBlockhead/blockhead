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
import { _GlobalSelector } from '$/schema/_Global.ts'
import { SpecificationProposalKindSelector } from '$/schema/SpecificationProposalKind.ts'
import { SpecificationProposalSelector } from '$/schema/SpecificationProposal.ts'

const ethereumProposalMarkdownBody = async (
	text: string,
	ledger: 'eip' | 'erc'
) => {
	const { ethereumEipSpecGithubRepoByLedger } = await import('$/sources/EthereumEips/Github/constants.ts')
	const target = ethereumEipSpecGithubRepoByLedger[ledger]
	const githubBlobBase = `https://github.com/${target.owner}/${target.repo}/blob/${target.ref}`
	const githubBlobPathBase = `${githubBlobBase}/${target.path}/`

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
				`](${githubBlobBase}/LICENSE.md${hash ?? ''})`
			)
		)
		.replace(
			/\]\((?![a-z][a-z0-9+.-]*:|\/|#)([^)\s]+)(#[^)]+)?\)/gi,
			(_match, href: string, hash: string | undefined) => (
				`](${new URL(href, githubBlobPathBase).href}${hash ?? ''})`
			)
		)
}

const ethereumEipErcProposalRowsFromGithubSpecs = async ({
	category,
	getContents,
	context,
}: {
	category?: typeof import('$/constants/SpecificationProposal.ts').ProposalCategory.Eip
	| typeof import('$/constants/SpecificationProposal.ts').ProposalCategory.Erc
	getContents: (input: { ledger: 'eip' | 'erc' }) => Promise<{
		type: string
		name: string
		download_url?: string | null
	}[]>
	context: SourceResolverContext<Source.EthereumEips_Github>
}) => {
	const { ProposalCategory } = await import('$/constants/SpecificationProposal.ts')
	const ledgers = (
		category === ProposalCategory.Erc ?
			[{ ledger: 'erc' as const, category: ProposalCategory.Erc }]
		: category === ProposalCategory.Eip ?
			[{ ledger: 'eip' as const, category: ProposalCategory.Eip }]
		:
			[
				{ ledger: 'eip' as const, category: ProposalCategory.Eip },
				{ ledger: 'erc' as const, category: ProposalCategory.Erc },
			]
	)
	const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
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
				const proposalNumberRaw = regex('^(?:eip|erc)-(?<proposalNumber>\\d+)\\.md$').exec(githubContent.name)?.groups.proposalNumber
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
	const limit = resolverContextRowLimit(context)

	return {
		rows: sortedProposals.slice(offset, offset + limit),
		totalCount: sortedProposals.length,
	}
}

export default {
	source: Source.EthereumEips_Github,

	resolvers: [
		defineResolver(Source.EthereumEips_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				[SpecificationProposalSelector.RealmCategoryNumber]: async ({ category, number, realm }) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				const {
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
					number: number,
				})
				if (text.trim() === '') throw new Error('EthereumEips_Github: empty proposal markdown')
				const body = await ethereumProposalMarkdownBody(
					text,
					category === ProposalCategory.Erc ? 'erc' : 'eip'
				)
				const fm = parseFrontmatter(text)
				return {
					documentCategory: fm.category?.trim() || undefined,
					documentTitle: fm.title?.trim() || undefined,
					documentStatus: fm.status?.trim() || undefined,
					documentBody: body.length > 0 ? body : undefined,
				}
			}
			}
		})({
				fields: {
			documentCategory: (snapshot) => snapshot.documentCategory,
			documentTitle: (snapshot) => snapshot.documentTitle,
			documentStatus: (snapshot) => snapshot.documentStatus,
			documentBody: (snapshot) => snapshot.documentBody,
		},
			}),

		defineResolver(Source.EthereumEips_Github, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_selector, context) => {
				const { getContents } = await import('$/sources/EthereumEips/Github/queries.ts')
				return ethereumEipErcProposalRowsFromGithubSpecs({
					getContents,
					context,
				})
			}
			}
		})({
				fields: {
			$$proposals: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.totalCount,
			},
		},
			}),

		defineResolver(Source.EthereumEips_Github, {
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[SpecificationProposalKindSelector.RealmCategory]: async ({ category, realm }, context) => {
					const { getContents } = await import('$/sources/EthereumEips/Github/queries.ts')
					const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
					if (
						realm !== SpecificationRealm.Ethereum
						|| (category !== ProposalCategory.Eip && category !== ProposalCategory.Erc)
					) {
						throw new Error('EthereumEips_Github: proposal kind resolver only supports Ethereum EIPs/ERCs')
					}
					return ethereumEipErcProposalRowsFromGithubSpecs({
						category,
						getContents,
						context,
					})
				}
			}
		})({
			fields: {
				$$proposals: {
					select: (snapshot) => snapshot.rows,
					resolveCount: (snapshot) => snapshot.totalCount,
				},
			},
		}),
	],
}

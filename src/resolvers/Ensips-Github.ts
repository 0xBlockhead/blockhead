import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { parseFrontmatter, stripFrontmatter } from '$/lib/markdownFrontmatter.ts'
import { regex } from 'arkregex'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { SpecificationProposalSelector } from '$/schema/SpecificationProposal.ts'
import { SpecificationRealmSelector } from '$/schema/SpecificationRealm.ts'
import { SpecificationProposalKindSelector } from '$/schema/SpecificationProposalKind.ts'

const githubEnsipProposalIndexRows = async (
	data: {
		type: string
		name: string
	}[],
) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	const markdownFiles = data.filter((githubContent) => githubContent.type === 'file' && githubContent.name.endsWith('.md'))
	const ensips = []
	for (const markdownFile of markdownFiles) {
		const proposalNumberRaw = regex('^(?<proposalNumber>\\d+)\\.md$').exec(markdownFile.name)?.groups.proposalNumber
		const proposalNumber = proposalNumberRaw != null ?
			parseInt(proposalNumberRaw, 10)
		:
			null

		if (proposalNumber == null) continue

		ensips.push({
			[EntityMetaKey.Selector]: {
				realm: SpecificationRealm.Ens,
				category: ProposalCategory.Ensip,
				number: proposalNumber,
			},
		})
	}
	return ensips
}

export default {
	source: Source.Ensips_Github,

	resolvers: [
		defineResolver(Source.Ensips_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				[SpecificationProposalSelector.RealmCategoryNumber]: async ({ category, number, realm }) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				const {
					getProposalMarkdownText,
				} = await import('$/sources/Ensips/Github/queries.ts')

				if (realm !== SpecificationRealm.Ens || category !== ProposalCategory.Ensip) {
					throw new Error('Ensips_Github: proposal resolver only supports ENSIPs')
				}
				const text = await getProposalMarkdownText({ number: number })
				const body = stripFrontmatter(text)
				const fm = parseFrontmatter(text)
				return {
					documentCategory: fm.category.trim() || undefined,
					documentTitle: (
						fm.title.trim()
						|| body.match(/#\s*(ENSIP-\d+:\s*.+)/)?.[1]?.trim()
						|| fm.description.trim()
					),
					documentStatus: fm.status.trim() || undefined,
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

		defineResolver(Source.Ensips_Github, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async () => {
				const { getContents } = await import('$/sources/Ensips/Github/queries.ts')
				return githubEnsipProposalIndexRows(await getContents())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.Ensips_Github, {
			entityType: EntityType.SpecificationRealm,
			resolve: {
				[SpecificationRealmSelector.Realm]: async ({ realm }) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.Ens) {
					throw new Error('Ensips_Github: $$proposals only supports SpecificationRealm.Ens')
				}
				const { getContents } = await import('$/sources/Ensips/Github/queries.ts')
				return githubEnsipProposalIndexRows(await getContents())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.Ensips_Github, {
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[SpecificationProposalKindSelector.RealmCategory]: async ({ category, realm }) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.Ens || category !== ProposalCategory.Ensip) {
					throw new Error('Ensips_Github: $$proposals only supports ENSIP proposal kind')
				}
				const { getContents } = await import('$/sources/Ensips/Github/queries.ts')
				return githubEnsipProposalIndexRows(await getContents())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),
	],
}

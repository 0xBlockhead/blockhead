import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { regex } from 'arkregex'
import { parseFrontmatter, stripFrontmatter } from '$/lib/markdownFrontmatter.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { SpecificationProposalSelector } from '$/schema/SpecificationProposal.ts'
import { SpecificationRealmSelector } from '$/schema/SpecificationRealm.ts'
import { SpecificationProposalKindSelector } from '$/schema/SpecificationProposalKind.ts'

const nearNepRows = async (entries: { type: string, name: string }[]) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return entries.flatMap((githubContent) => {
		const proposalNumberRaw = regex('^nep-(?<proposalNumber>\\d{4})\\.md$').exec(githubContent.name)?.groups.proposalNumber
		return githubContent.type !== 'file' || proposalNumberRaw == null ?
			[]
		:
			[{
				[EntityMetaKey.Selector]: {
					realm: SpecificationRealm.Near,
					category: ProposalCategory.Nep,
					number: parseInt(proposalNumberRaw, 10),
				},
			}]
	})
}

export default {
	source: Source.NearNeps_Github,

	resolvers: [
		defineResolver(Source.NearNeps_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				[SpecificationProposalSelector.RealmCategoryNumber]: async ({ category, number, realm }) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.Near || category !== ProposalCategory.Nep) {
					throw new Error('NearNeps_Github: proposal resolver only supports NEAR NEPs')
				}
				const { getMarkdownText } = await import('$/sources/NearNeps/Github/queries.ts')
				const text = await singleFlight(getMarkdownText)({ number: number })
				const frontmatter = parseFrontmatter(text)
				const body = stripFrontmatter(text)
				return {
					documentCategory: frontmatter.category.trim(),
					documentTitle: frontmatter.title.trim(),
					documentStatus: frontmatter.status.trim(),
					documentBody: body,
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

		defineResolver(Source.NearNeps_Github, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async () => {
				const { getContents } = await import('$/sources/NearNeps/Github/queries.ts')
				return nearNepRows(await getContents())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.NearNeps_Github, {
			entityType: EntityType.SpecificationRealm,
			resolve: {
				[SpecificationRealmSelector.Realm]: async ({ realm }) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.Near) throw new Error('NearNeps_Github: $$proposals only supports NEAR')
				const { getContents } = await import('$/sources/NearNeps/Github/queries.ts')
				return nearNepRows(await getContents())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.NearNeps_Github, {
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[SpecificationProposalKindSelector.RealmCategory]: async ({ category, realm }) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.Near || category !== ProposalCategory.Nep) throw new Error('NearNeps_Github: $$proposals only supports NEAR NEPs')
				const { getContents } = await import('$/sources/NearNeps/Github/queries.ts')
				return nearNepRows(await getContents())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),
	],
}

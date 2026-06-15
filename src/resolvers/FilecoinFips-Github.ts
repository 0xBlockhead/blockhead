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

const githubFilecoinFipProposalRows = async (
	data: {
		type: string
		name: string
	}[],
) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return data.flatMap((githubContent) => {
		const proposalNumberRaw = regex('^fip-(?<proposalNumber>\\d+)\\.md$').exec(githubContent.name)?.groups.proposalNumber
		return githubContent.type !== 'file' || proposalNumberRaw == null ?
			[]
		:
			[{
				[EntityMetaKey.Selector]: {
					realm: SpecificationRealm.Filecoin,
					category: ProposalCategory.Fip,
					number: parseInt(proposalNumberRaw, 10),
				},
			}]
	})
}

export default {
	source: Source.FilecoinFips_Github,

	resolvers: [
		defineResolver(Source.FilecoinFips_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				[SpecificationProposalSelector.RealmCategoryNumber]: async ({ category, number, realm }) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.Filecoin || category !== ProposalCategory.Fip) {
					throw new Error('FilecoinFips_Github: unsupported proposal id')
				}
				const { getMarkdownText } = await import('$/sources/FilecoinFips/Github/queries.ts')
				const text = await getMarkdownText({ number: number })
				const body = stripFrontmatter(text)
				const frontmatter = parseFrontmatter(text)
				return {
					documentCategory: frontmatter.type.trim() || undefined,
					documentTitle: frontmatter.title.trim() || undefined,
					documentStatus: frontmatter.status.trim() || undefined,
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

		defineResolver(Source.FilecoinFips_Github, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async () => {
				const { getContents } = await import('$/sources/FilecoinFips/Github/queries.ts')
				return githubFilecoinFipProposalRows(await getContents())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.FilecoinFips_Github, {
			entityType: EntityType.SpecificationRealm,
			resolve: {
				[SpecificationRealmSelector.Realm]: async ({ realm }) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.Filecoin) {
					throw new Error('FilecoinFips_Github: $$proposals only supports SpecificationRealm.Filecoin')
				}
				const { getContents } = await import('$/sources/FilecoinFips/Github/queries.ts')
				return githubFilecoinFipProposalRows(await getContents())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.FilecoinFips_Github, {
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[SpecificationProposalKindSelector.RealmCategory]: async ({ category, realm }) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.Filecoin || category !== ProposalCategory.Fip) {
					throw new Error('FilecoinFips_Github: $$proposals only supports Filecoin FIP proposal kind')
				}
				const { getContents } = await import('$/sources/FilecoinFips/Github/queries.ts')
				return githubFilecoinFipProposalRows(await getContents())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),
	],
}

import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import { parseFrontmatter, stripFrontmatter } from '$/lib/markdownFrontmatter.ts'
import { regex } from 'arkregex'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

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
				[EntityMetaKey.Id]: {
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
		defineResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Filecoin || entityId.category !== ProposalCategory.Fip) {
					throw new Error('FilecoinFips_Github: unsupported proposal id')
				}
				const { getMarkdownText } = await import('$/sources/FilecoinFips/Github/queries.ts')
				const text = await singleFlight(getMarkdownText)({ number: entityId.number })
				const body = stripFrontmatter(text)
				const frontmatter = parseFrontmatter(text)
				return {
					documentCategory: frontmatter.type.trim() || undefined,
					documentTitle: frontmatter.title.trim() || undefined,
					documentStatus: frontmatter.status.trim() || undefined,
					documentBody: body.length > 0 ? body : undefined,
				}
			}
			},
			fields: {
			documentCategory: (snapshot) => snapshot.documentCategory,
			documentTitle: (snapshot) => snapshot.documentTitle,
			documentStatus: (snapshot) => snapshot.documentStatus,
			documentBody: (snapshot) => snapshot.documentBody,
		}
		}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async () => {
				const { getContents } = await import('$/sources/FilecoinFips/Github/queries.ts')
				return githubFilecoinFipProposalRows(await singleFlight(getContents)())
			}
			},
			fields: {
			$$proposals: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.SpecificationRealm,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Filecoin) {
					throw new Error('FilecoinFips_Github: $$proposals only supports SpecificationRealm.Filecoin')
				}
				const { getContents } = await import('$/sources/FilecoinFips/Github/queries.ts')
				return githubFilecoinFipProposalRows(await singleFlight(getContents)())
			}
			},
			fields: {
			$$proposals: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Filecoin || entityId.category !== ProposalCategory.Fip) {
					throw new Error('FilecoinFips_Github: $$proposals only supports Filecoin FIP proposal kind')
				}
				const { getContents } = await import('$/sources/FilecoinFips/Github/queries.ts')
				return githubFilecoinFipProposalRows(await singleFlight(getContents)())
			}
			},
			fields: {
			$$proposals: (snapshot) => snapshot,
		}
		}),
	],
}

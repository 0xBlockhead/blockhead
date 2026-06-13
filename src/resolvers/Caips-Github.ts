import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { parseFrontmatter, stripFrontmatter } from '$/lib/markdownFrontmatter.ts'
import { regex } from 'arkregex'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const githubCaipProposalIndexRows = async (
	data: {
		type: string
		name: string
	}[],
) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	const markdownFiles = data.filter((githubContent) => githubContent.type === 'file' && githubContent.name.endsWith('.md'))
	return markdownFiles.flatMap((markdownFile) => {
		const caipNumberRaw = regex('^caip-(?<caipNumber>\\d+)\\.md$').exec(markdownFile.name)?.groups.caipNumber
		const caipNumber = caipNumberRaw != null ?
			parseInt(caipNumberRaw, 10)
		:
			null

		return caipNumber == null ?
			[]
		:
			[{
				[EntityMetaKey.Id]: {
					realm: SpecificationRealm.ChainAgnostic,
					category: ProposalCategory.Caip,
					number: caipNumber,
				},
			}]
	})
}

export default {
	source: Source.Caips_Github,

	resolvers: [
		defineResolver(Source.Caips_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				const {
					getMarkdownTextForNumber,
				} = await import('$/sources/Caips/Github/queries.ts')

				if (
					entityId.category !== ProposalCategory.Caip
					|| entityId.realm !== SpecificationRealm.ChainAgnostic
				) throw new Error('Caips_Github: unsupported proposal id')
				const text = await singleFlight(getMarkdownTextForNumber)({ number: entityId.number })
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

		defineResolver(Source.Caips_Github, {
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async () => {
				const { getContents } = await import('$/sources/Caips/Github/queries.ts')
				return githubCaipProposalIndexRows(await singleFlight(getContents)())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.Caips_Github, {
			entityType: EntityType.SpecificationRealm,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.ChainAgnostic) {
					throw new Error('Caips_Github: $$proposals only supports SpecificationRealm.ChainAgnostic')
				}
				const { getContents } = await import('$/sources/Caips/Github/queries.ts')
				return githubCaipProposalIndexRows(await singleFlight(getContents)())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.Caips_Github, {
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.ChainAgnostic || entityId.category !== ProposalCategory.Caip) {
					throw new Error('Caips_Github: $$proposals only supports CAIP proposal kind')
				}
				const { getContents } = await import('$/sources/Caips/Github/queries.ts')
				return githubCaipProposalIndexRows(await singleFlight(getContents)())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),
	],
}

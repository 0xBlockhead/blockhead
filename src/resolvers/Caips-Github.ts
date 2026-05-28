import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { parseFrontmatter, stripFrontmatter } from '$/lib/markdownFrontmatter.ts'
import { regex } from 'arkregex'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const githubCaipProposalIndexRows = async (
	data: {
		type: string
		name: string
	}[],
) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	const markdownFiles = data.filter((entry) => entry.type === 'file' && entry.name.endsWith('.md'))
	return markdownFiles.flatMap((markdownFile) => {
		const caipNumberRaw = regex('^caip-(?<caipNumber>\\d+)\\.md$').exec(markdownFile.name)?.groups?.caipNumber
		const caipNumber = caipNumberRaw != null ? parseInt(caipNumberRaw, 10) : null
		return caipNumber == null ?
			[]
		:	[{
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

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				const {
					getCaipMarkdownTextForNumber,
				} = await import('$/sources/Caips/Github/queries.ts')

				if (
					entityId.category !== ProposalCategory.Caip
					|| entityId.realm !== SpecificationRealm.ChainAgnostic
				) throw new Error('Caips_Github: unsupported proposal id')
				const text = await singleFlight(getCaipMarkdownTextForNumber)({ number: entityId.number })
				const body = stripFrontmatter(text)
				const frontmatter = parseFrontmatter(text)
				return {
					documentCategory: (
						((docCategory) => (
							docCategory != null && docCategory !== '' ? docCategory : null
						))(frontmatter.type?.trim())
					),
					documentTitle: (
						((docTitle) => (
							docTitle != null && docTitle !== '' ? docTitle : null
						))(frontmatter.title?.trim())
					),
					documentStatus: (
						((docStatus) => (
							docStatus != null && docStatus !== '' ? docStatus : null
						))(frontmatter.status?.trim())
					),
					documentBody: body.length > 0 ? body : null,
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$proposals',
			resolve: async () => {
				const { getCaipsGithubContents } = await import('$/sources/Caips/Github/queries.ts')
				return githubCaipProposalIndexRows(await singleFlight(getCaipsGithubContents)())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.ChainAgnostic) {
					throw new Error('Caips_Github: $$proposals only supports SpecificationRealm.ChainAgnostic')
				}
				const { getCaipsGithubContents } = await import('$/sources/Caips/Github/queries.ts')
				return githubCaipProposalIndexRows(await singleFlight(getCaipsGithubContents)())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.ChainAgnostic || entityId.category !== ProposalCategory.Caip) {
					throw new Error('Caips_Github: $$proposals only supports CAIP proposal kind')
				}
				const { getCaipsGithubContents } = await import('$/sources/Caips/Github/queries.ts')
				return githubCaipProposalIndexRows(await singleFlight(getCaipsGithubContents)())
			},
		}),
	],
}

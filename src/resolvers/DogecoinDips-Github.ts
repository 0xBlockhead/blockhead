import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { regex } from 'arkregex'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
const dipMetadataValue = (text: string, key: string) => (
	new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim()
)

export default {
	source: Source.DogecoinDips_Github,

	resolvers: [
		defineResolver(Source.DogecoinDips_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				RealmCategoryNumber: {
					appliesTo: [
						{
							realm: SpecificationRealm.Dogecoin,
							category: ProposalCategory.Dip,
						},
					],
					resolve: async ({ category, number, realm }) => {
						const { getMediaWikiText } = await import('$/sources/DogecoinDips/Github/queries.ts')
						if (realm !== SpecificationRealm.Dogecoin || category !== ProposalCategory.Dip)
							throw new Error('DogecoinDips_Github: proposal resolver only supports Dogecoin DIPs')

						const text = await getMediaWikiText({
							number,
						})
						if (text.trim() === '')
							throw new Error('DogecoinDips_Github: empty proposal text')

						return {
							documentCategory: dipMetadataValue(text, 'Type'),
							documentTitle: dipMetadataValue(text, 'Title'),
							documentStatus: dipMetadataValue(text, 'Status'),
							documentBody: text,
						}
					},
				},
			},
		})({
				documentCategory: (snapshot) => snapshot.documentCategory,
				documentTitle: (snapshot) => snapshot.documentTitle,
				documentStatus: (snapshot) => snapshot.documentStatus,
				documentBody: (snapshot) => snapshot.documentBody,
			}),

		defineResolver(Source.DogecoinDips_Github, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => {
						const { getContents } = await import('$/sources/DogecoinDips/Github/queries.ts')
						return (await getContents()).flatMap((githubContent) => {
							const proposalNumberRaw = regex('^dip-(?<proposalNumber>\\d{4})\\.mediawiki$').exec(githubContent.name)?.groups.proposalNumber
							return githubContent.type !== 'file' || proposalNumberRaw == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: {
										realm: SpecificationRealm.Dogecoin,
										category: ProposalCategory.Dip,
										number: parseInt(proposalNumberRaw, 10),
									},
								}]
						})
					},
				},
			},
		})({
				$$proposals: (snapshot) => snapshot,
			}),
	],
}

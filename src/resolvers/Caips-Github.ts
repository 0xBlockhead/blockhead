import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$defineEntityResolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { GhFile } from '$/sources/Github/Rest/types.ts'
import { Source } from '$/sources/$Sources.ts'

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Caip,
			source: Source.Caips,
			resolve: async (entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const {
					getCaipHumanDocUrl,
					getCaipMarkdownTextForNumber,
					parseFrontmatter,
					stripFrontmatter,
				} = await import('$/sources/Caips/Github/queries.ts')
				const idStr = String(entityId.id)
				const n = Number(idStr)
				if (Number.isNaN(n)) return {}
				const text = await singleFlight(getCaipMarkdownTextForNumber)({ number: n })
				const fm = parseFrontmatter(text)
				const caipNum = fm.caip != null ? parseInt(fm.caip, 10) : n
				const createdRaw = fm.created?.trim()
				const created = (
					createdRaw != null && createdRaw !== '' ?
						(createdRaw.split(',')[0]?.trim() ?? undefined)
					:
						undefined
				)
				const body = stripFrontmatter(text)
				return {
					number: caipNum,
					title: fm.title ?? `caip-${caipNum}`,
					status: fm.status ?? '',
					type: fm.type ?? '',
					url: getCaipHumanDocUrl({ number: caipNum }),
					...(created != null && created !== '' ? { created } : {}),
					body: body.length > 0 ? body : null,
				}
			},
		}),
	],
	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$caips',
			source: Source.Caips,
			resolve: async (_entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const {
					getCaipsGithubContents,
				} = await import('$/sources/Caips/Github/queries.ts')
				const data = await singleFlight(getCaipsGithubContents)()
				if (!Array.isArray(data)) throw new Error('GitHub (CAIPs): directory response is not an array')
				const files = data.filter((f: GhFile) => f.type === 'file' && f.name.endsWith('.md'))
				return [...files
					.flatMap((f) => {
						const nameMatch = f.name.match(/^caip-(\d+)\.md$/)
						const number = nameMatch != null ? parseInt(nameMatch[1], 10) : null
						return number == null ?
							[]
						:	[{
								[EntityMetaKey.Id]: { id: String(number) },
							}]
					})
					.reduce((rowsById, row) => (
						rowsById.set(row[EntityMetaKey.Id].id, row)
					), new Map())]
					.map(([, row]) => row)
					.sort((a, b) => Number(a[EntityMetaKey.Id].id) - Number(b[EntityMetaKey.Id].id))
			},
		}),
	],
}

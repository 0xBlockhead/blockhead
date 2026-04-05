import type {
	EntityFieldResolver,
	EntityFieldResolverContext,
} from '$/resolvers/$EntityFieldResolver.ts'
import type { EntityResolver } from '$/resolvers/$EntityResolver.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	sliceRowsForResolverSubset,
	subsetFilterEqAsNumber,
	subsetFilterEqValue,
} from '$/data/tanstackDb/resolverLoadSubset.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import {
	getCaipHumanDocUrl,
	getCaipMarkdownTextForNumber,
	getCaipsGithubContents,
	getCaipsRawMarkdownText,
	parseFrontmatter,
	stripFrontmatter,
} from '$/sources/Caips/Github/queries.ts'
import type { GhFile } from '$/sources/Github/Rest/types.ts'
import { Source } from '$/sources/$Sources.ts'

export default {
	source: Source.Caips,
	entityResolvers: [
		{
			entityType: EntityType.Caip,
			resolve: async (entityId) => {
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
		},
	],
	entityFieldResolvers: [
		{
			entityType: EntityType._Global,
			field: '$$caips',
			resolve: async (_entityId, context?: EntityFieldResolverContext) => {
				const filters = context?.loadSubset?.filters ?? []
				const data = await singleFlight(getCaipsGithubContents)()
				if (!Array.isArray(data)) throw new Error('GitHub (CAIPs): directory response is not an array')
				const files = data.filter((f: GhFile) => f.type === 'file' && f.name.endsWith('.md'))
				const results = await Promise.all(
					files.map(async (f) => {
						const nameMatch = f.name.match(/^caip-(\d+)\.md$/)
						const num = nameMatch != null ? parseInt(nameMatch[1], 10) : null
						if (num == null) return null
						const fm = parseFrontmatter(
							await singleFlight(getCaipsRawMarkdownText)({
								fileName: f.name,
								downloadUrl: f.download_url,
							}),
						)
						const caipNum = fm.caip != null ? parseInt(fm.caip, 10) : num
						const createdRaw = fm.created?.trim()
						const created = (
							createdRaw != null && createdRaw !== '' ?
								(createdRaw.split(',')[0]?.trim() ?? undefined)
							:
								undefined
						)
						return {
							$id: { id: String(caipNum) },
							number: caipNum,
							title: fm.title ?? f.name.replace(/\.md$/, ''),
							status: fm.status ?? '',
							type: fm.type ?? '',
							url: getCaipHumanDocUrl({ number: caipNum }),
							...(created != null && created !== '' ? { created } : {}),
							body: null,
						}
					}),
				)
				let rows = results
					.filter((e) => e != null)
					.sort((a, b) => a.number - b.number)
				const numEq = subsetFilterEqAsNumber(filters, 'number')
				if (numEq != null) rows = rows.filter((e) => e.number === numEq)
				const idEq = subsetFilterEqValue(filters, '$id.id')
				if (typeof idEq === 'string' && idEq.length > 0) rows = rows.filter((e) => e.$id.id === idEq)
				return sliceRowsForResolverSubset(rows, context?.loadSubset)
			},
		},
	],
} satisfies {
	source: Source
	entityResolvers: readonly [EntityResolver<EntityType.Caip>]
	entityFieldResolvers: readonly EntityFieldResolver<
		EntityType._Global,
		'$$caips'
	>[]
}

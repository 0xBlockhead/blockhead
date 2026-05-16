import { type } from 'arktype'

import { resolveMediaUrlTransport } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { Entity } from '$/schema/$schema.ts'
import { UrlString } from '$/schema/$Url.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export const canonicalPublicHttpUrlFromCatalogString = (raw: string): string => {
	const trimmed = raw.trim()
	const absolute = (
		trimmed.startsWith('http://')
		|| trimmed.startsWith('https://') ?
			trimmed
		: trimmed.startsWith('//') ?
			`https:${trimmed}`
		:	`https://${trimmed}`
	)
	return new URL(absolute).toString()
}

export type BlockExplorerCatalogWire = {
	origin: string
	name?: string
	standard?: string
	icon?: string
}

type ExplorerWireLike = {
	name: string
	url: string
	standard?: string | null
	icon?: string | null
}

export const blockExplorerCatalogWireFromExplorersAndInfoUrl = ({
	explorers,
	infoURL,
}: {
	explorers: ExplorerWireLike[] | undefined
	infoURL: string | undefined | null
}): BlockExplorerCatalogWire[] => [
	...(explorers ?? [])
		.flatMap((explorer) => (
			explorer.url.trim() === '' ?
				[]
			:	[
					{
						origin: explorer.url,
						...(explorer.name.trim() !== '' && { name: explorer.name }),
						...(explorer.standard != null && String(explorer.standard).trim() !== '' && { standard: String(explorer.standard).trim() }),
						...(explorer.icon != null && String(explorer.icon).trim() !== '' && { icon: String(explorer.icon).trim() }),
					},
				]
		)),
	...(
		infoURL?.trim() != null
		&& infoURL.trim() !== ''
		&& !(explorers ?? []).some((explorer) => explorer.url === infoURL.trim()) ?
			[{ origin: infoURL.trim() }]
		:
			[]
	),
]

export const urlEntitiesDeduplicatedSortedFromBlockExplorerCatalog = (
	blockExplorers: BlockExplorerCatalogWire[],
): Entity<typeof schema, EntityType.Url>[] => {
	const byUrl = new Map<string, Entity<typeof schema, EntityType.Url>>()
	for (const explorer of blockExplorers) {
		const originTrimmed = explorer.origin.trim()
		if (originTrimmed === '') continue
		const url = canonicalPublicHttpUrlFromCatalogString(originTrimmed)
		if (byUrl.has(url)) continue
		const hrefAsUrlString = UrlString(url)
		if (hrefAsUrlString instanceof type.errors) continue
		const catalogIconResolved = (
			explorer.icon == null || explorer.icon.trim() === '' ?
				undefined
			:	resolveMediaUrlTransport(explorer.icon.trim())?.url
		)
		let catalogIconAsUrlString: typeof hrefAsUrlString | undefined
		if (catalogIconResolved != null) {
			const iconParsed = UrlString(catalogIconResolved)
			if (!(iconParsed instanceof type.errors)) catalogIconAsUrlString = iconParsed
		}
		byUrl.set(url, {
			[EntityMetaKey.Id]: { url: hrefAsUrlString },
			...(explorer.name != null && explorer.name.trim() !== '' && { catalogName: explorer.name.trim() }),
			...(explorer.standard != null && explorer.standard.trim() !== '' && { catalogStandard: explorer.standard.trim() }),
			...(catalogIconAsUrlString != null && { catalogIcon: catalogIconAsUrlString }),
		} as Entity<typeof schema, EntityType.Url>)
	}
	return (
		[...byUrl.values()].toSorted((left, right) => (
			left[EntityMetaKey.Id].url.localeCompare(right[EntityMetaKey.Id].url)
		))
	)
}

export const urlEntitiesDeduplicatedSortedFromFaucetUrlStrings = (
	faucetUrls: string[],
): Entity<typeof schema, EntityType.Url>[] => {
	const byUrl = new Map<string, Entity<typeof schema, EntityType.Url>>()
	for (const raw of faucetUrls) {
		if (raw.trim() === '') continue
		const url = canonicalPublicHttpUrlFromCatalogString(raw)
		if (byUrl.has(url)) continue
		const hrefAsUrlString = UrlString(url)
		if (hrefAsUrlString instanceof type.errors) continue
		byUrl.set(url, { [EntityMetaKey.Id]: { url: hrefAsUrlString } } as Entity<typeof schema, EntityType.Url>)
	}
	return (
		[...byUrl.values()].toSorted((left, right) => (
			left[EntityMetaKey.Id].url.localeCompare(right[EntityMetaKey.Id].url)
		))
	)
}

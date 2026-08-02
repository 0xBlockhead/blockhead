export const normalizeRssFeedUrl = (feedUrl: string) => (
	new URL(feedUrl.trim()).href
)

export const rssItemIdentityFromParts = (
	guid: string | undefined,
	link: string | undefined
) => {
	const normalizedGuid = guid?.trim()
	if (normalizedGuid)
		return {
			itemIdentityKind: 'Guid',
			itemIdentity: normalizedGuid,
		} as const

	const normalizedLink = link?.trim()
	if (normalizedLink)
		return {
			itemIdentityKind: 'Link',
			itemIdentity: new URL(normalizedLink).href,
		} as const
}

export const rssTimestampMs = (value: string | undefined) => {
	const trimmed = value?.trim()
	return (
		trimmed ?
			Number.isFinite(Date.parse(trimmed)) ?
				Date.parse(trimmed)
			:
				undefined
		:
			undefined
	)
}

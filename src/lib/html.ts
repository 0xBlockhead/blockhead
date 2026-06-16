export const htmlToPlainText = (html: string | null | undefined) => (
	(html ?? '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
)

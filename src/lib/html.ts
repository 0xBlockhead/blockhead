export const htmlToPlainText = (raw: string) => (
	raw
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
)

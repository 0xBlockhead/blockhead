export const htmlToPlainText = (raw: unknown) => {
	let s = ''
	try {
		s = raw == null ? '' : String(raw)
	}
	catch {
		s = ''
	}
	return (
		s
			.replace(/<[^>]+>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()
	)
}

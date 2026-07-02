const stripFrontmatterPattern = /^---\s*\n[\s\S]*?\n---\s*\n?/
const frontmatterBlockPattern = /^---\s*\n(?<frontmatterBlock>[\s\S]*?)\n---/

export const parseFrontmatter = (text: string): Partial<Record<string, string>> => {
	const block = frontmatterBlockPattern.exec(text)?.groups?.frontmatterBlock
	if (block == null) return {}
	const out: Partial<Record<string, string>> = {}
	for (const line of block.split('\n')) {
		const colon = line.indexOf(':')
		if (colon < 0) continue
		const key = line.slice(0, colon).trim().toLowerCase()
		const val = line.slice(colon + 1).trim().replace(/^['"]|['"]$/g, '')
		if (key && val) out[key] = val
	}
	return out
}

export const stripFrontmatter = (text: string) => (
	text.replace(stripFrontmatterPattern, '').trim()
)

import { regex } from 'arkregex'
import { getJson as fetchGetJson, getText as fetchGetText } from '$/lib/http.ts'
import Github from '$/sources/Github/index.ts'
import { restHeaders, restOrigin } from '$/sources/Github/Rest/constants.ts'

const stripFrontmatterPattern = regex('^---\\s*\\n[\\s\\S]*?\\n---\\s*\\n?')
const frontmatterBlockPattern = regex('^---\\s*\\n(?<frontmatterBlock>[\\s\\S]*?)\\n---')

const isGithubRestApiUrl = (url: string) => url.startsWith(restOrigin)

const githubInit = (url: string): RequestInit | undefined => (
	isGithubRestApiUrl(url) ?
		{ headers: restHeaders }
	:	undefined
)

export const githubHttp = ({ url }: { url: string }): Promise<Response> => (
	fetch(url, githubInit(url) ?? {})
)

export const getJson = ({ url }: { url: string }): Promise<unknown> => (
	fetchGetJson<unknown>(url, {
		origins: Github.origins,
		init: githubInit(url),
	})
)

export const getText = ({ url }: { url: string }): Promise<string> => (
	fetchGetText(url, {
		origins: Github.origins,
		init: githubInit(url),
	})
)

export const parseFrontmatter = (text: string): Record<string, string> => {
	const block = frontmatterBlockPattern.exec(text)?.groups?.frontmatterBlock
	if (block == null) return {}
	const out: Record<string, string> = {}
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

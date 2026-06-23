import { getGithubContents, getGithubRawText } from '$/sources/_shared/hosts/Github/Http/client.ts'
import { codexNetworkPresetsBindings } from '$/sources/CodexNetworkPresets/bindings.ts'

const target = {
	owner: 'codex-storage-network',
	repo: 'codex-network-presets',
	ref: 'master',
	path: '',
} as const

export const getContents = () => (
	getGithubContents({
		endpoints: codexNetworkPresetsBindings[0].endpoints,
		target,
	})
)

export const getRawText = (path: string) => (
	getGithubRawText({
		endpoints: codexNetworkPresetsBindings[0].endpoints,
		target: {
			...target,
			path,
		},
	})
)

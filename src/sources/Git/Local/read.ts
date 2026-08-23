import { isJsonArray, isJsonObject, isJsonString, type JsonValue } from '$/typescript/JsonValue.ts'
import type { GitLocalPlatformAdapter, GitLocalRefRead, GitLocalRepositoryRead } from '$/sources/Git/Local/types.ts'

const objectIdPattern = /^[0-9a-f]{40}$|^[0-9a-f]{64}$/
const refNamePattern = /^(?!.*\.\.)(?!.*[ ~^:?*\\\[\x00-\x20\x7f])(?!.*\.$)(?!.*\/$)(?!.*\.@)(?!.*\.$)[^\n\r]+$/

const rejectUnsafeInput = (value: string, label: string) => {
	if (value.includes('\n') || value.includes('\r') || value.startsWith('-') || value.includes('/') && label === 'repository ID')
		throw new Error(`Git_Local: invalid ${label}`)
}

const forbiddenKeyPattern = /(?:path|credential|token|password|secret)/i

const containsForbiddenKey = (value: JsonValue): boolean => {
	if (isJsonArray(value)) return value.some(containsForbiddenKey)
	if (!isJsonObject(value)) return false
	return Object.entries(value).some(([key, child]) => forbiddenKeyPattern.test(key) || containsForbiddenKey(child))
}

const parseRef = (value: JsonValue, objectFormat: 'sha1' | 'sha256'): GitLocalRefRead | undefined => {
	if (!isJsonObject(value) || !isJsonString(value.refName) || !isJsonString(value.refKind) || !isJsonString(value.targetObjectId)) return undefined
	if (!refNamePattern.test(value.refName) || value.refName.startsWith('-') || !objectIdPattern.test(value.targetObjectId) || value.targetObjectId.length !== (objectFormat === 'sha1' ? 40 : 64)) return undefined
	return { refName: value.refName, refKind: value.refKind, targetObjectId: value.targetObjectId }
}

export const readGitRepository = async (repositoryId: string, adapter: GitLocalPlatformAdapter): Promise<GitLocalRepositoryRead> => {
	rejectUnsafeInput(repositoryId, 'repository ID')
	let payload: JsonValue
	try { payload = JSON.parse(await adapter.readRepository(repositoryId)) as JsonValue } catch { throw new Error('Git_Local: invalid local Git repository payload') }
	if (!isJsonObject(payload) || payload.repositoryId !== repositoryId || (payload.objectFormat !== 'sha1' && payload.objectFormat !== 'sha256') || !isJsonArray(payload.refs))
		throw new Error('Git_Local: invalid local Git repository payload')
	const refs = payload.refs.map((ref) => parseRef(ref, payload.objectFormat))
	if (refs.some((ref) => ref == null) || ('defaultRefName' in payload && (!isJsonString(payload.defaultRefName) || !refNamePattern.test(payload.defaultRefName) || payload.defaultRefName.startsWith('-'))))
		throw new Error('Git_Local: invalid local Git repository payload')
	if (containsForbiddenKey(payload))
		throw new Error('Git_Local: local payload contains forbidden path or credential fields')
	return {
		repositoryId,
		objectFormat: payload.objectFormat,
		...(isJsonString(payload.defaultRefName) && { defaultRefName: payload.defaultRefName }),
		refs: refs.filter((ref): ref is GitLocalRefRead => ref != null),
	}
}

import { inspectRepositoryPayload } from '$/sources/RadicleCli/Local/queries.ts'
import { isJsonObject, isJsonString, type JsonValue } from '$/typescript/JsonValue.ts'
import type { RadicleCliPlatformAdapter, RadicleRepositoryRead } from '$/sources/RadicleCli/Local/types.ts'

export const readRadicleRepository = async (
	repositoryId: string,
	adapter: RadicleCliPlatformAdapter
): Promise<RadicleRepositoryRead> => {
	let payload: JsonValue
	try {
		payload = JSON.parse(await adapter.read(inspectRepositoryPayload(repositoryId))) as JsonValue
	} catch {
		throw new Error('RadicleCli_Local: invalid rad inspect repository payload')
	}
	if (!isJsonObject(payload))
		throw new Error('RadicleCli_Local: rad inspect payload was not an object')
	const git = isJsonObject(payload.git) ? payload.git : undefined
	if (
		payload.rid !== repositoryId
		|| payload.visibility !== 'public'
		|| git == null
		|| !isJsonString(git.repositoryId)
		|| git.repositoryId.length === 0
		|| (git.objectFormat !== 'sha1' && git.objectFormat !== 'sha256')
	)
		throw new Error('RadicleCli_Local: invalid rad inspect repository payload')
	return {
		rid: repositoryId,
		...(isJsonString(payload.name) && { name: payload.name }),
		...(isJsonString(payload.description) && { description: payload.description }),
		visibility: payload.visibility,
		...(isJsonString(payload.defaultBranch) && { defaultBranch: payload.defaultBranch }),
		git: {
			repositoryId: git.repositoryId,
			objectFormat: git.objectFormat,
		},
	}
}

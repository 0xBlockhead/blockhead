/**
 * Codex node REST queries for identity and local data membership.
 *
 * @see https://api.codex.storage/
 * @see https://raw.githubusercontent.com/logos-storage/logos-storage-nim/master/openapi.yaml
 */
import {
	getJson,
} from '$/sources/_shared/wire/HttpRest/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	codexNodeDataEnvelope,
	codexNodePeerIdEnvelope,
} from '$/sources/CodexNode/Rest/types.ts'

const sourceLabel = 'CodexNode_Rest'
const apiPath = '/api/storage/v1'

const assertEnvelope = <_Value>(
	envelope: {
		assert: (value: unknown) => _Value
	},
	value: unknown,
	label: string
): _Value => {
	try {
		return envelope.assert(value)
	} catch {
		throw new Error(`${sourceLabel}: invalid ${label} response envelope`)
	}
}

export const getPeerId = async (
	binding: SourceBinding
) => {
	const response = assertEnvelope(
		codexNodePeerIdEnvelope,
		await getJson<unknown>(binding, `${apiPath}/peerid`),
		'peer id'
	)

	return response.id
}

export const listData = async (
	binding: SourceBinding
) => {
	const response = assertEnvelope(
		codexNodeDataEnvelope,
		await getJson<unknown>(binding, `${apiPath}/data`),
		'data list'
	)

	return response.content
}

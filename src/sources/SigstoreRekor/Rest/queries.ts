import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/SigstoreRekor/bindings.ts'
import type { operations } from '$/sources/SigstoreRekor/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.SigstoreRekor][0]

export const getLogInfo = () => (
	getJson<operations['getLogInfo']['responses'][200]['content']['application/json']>(
		binding,
		'/api/v1/log'
	)
)

export const getLogEntry = async ({
	entryUUID,
}: operations['getLogEntryByUUID']['parameters']['path']) => {
	const entry = await getJson<operations['getLogEntryByUUID']['responses'][200]['content']['application/json']>(
		binding,
		`/api/v1/log/entries/${encodeURIComponent(entryUUID)}`
	)
	if (!Object.hasOwn(entry, entryUUID))
		throw new Error('SigstoreRekor: foreign log entry response')
	return entry
}

import { getJson } from '$/lib/http.ts'
import Openchain from '$/sources/Openchain/index.ts'
import { signatureBaseUrl } from '$/sources/Openchain/Rest/constants.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const openchainGetJson = <T = JsonValue>({ path }: { path: string }): Promise<T> => {
	const url = `${signatureBaseUrl}${path.startsWith('/') ? path : `/${path}`}`
	return getJson<T>(url, { origins: Openchain.origins })
}

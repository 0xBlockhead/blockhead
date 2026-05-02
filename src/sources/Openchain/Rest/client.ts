import { getJson } from '$/lib/http.ts'
import Openchain from '$/sources/Openchain/index.ts'
import { signatureBaseUrl } from '$/sources/Openchain/Rest/constants.ts'

export const openchainGetJson = ({ path }: { path: string }): Promise<unknown> => {
	const url = `${signatureBaseUrl}${path.startsWith('/') ? path : `/${path}`}`
	return getJson<unknown>(url, { origins: Openchain.origins })
}

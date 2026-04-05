import { getJson } from '$/lib/fetch.ts'
import { openchainSignatureDatabaseV1BaseUrl } from '$/sources/Openchain/Rest/constants.ts'

export const openchainGetJson = ({ path }: { path: string }): Promise<unknown> => {
	const url = `${openchainSignatureDatabaseV1BaseUrl}${path.startsWith('/') ? path : `/${path}`}`
	return getJson<unknown>(url)
}

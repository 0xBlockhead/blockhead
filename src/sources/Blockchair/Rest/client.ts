/**
 * Blockchair REST API v2 JSON over HTTP.
 *
 * @see https://blockchair.com/api/docs
 * @see https://github.com/Blockchair/Blockchair.Support/blob/master/API.md
 */

import {
	optionalPublicEnvString,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Blockchair/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Blockchair_Rest][0]

export type BlockchairSearchParams = Record<
	string,
	| boolean
	| number
	| string
	| undefined
>

const blockchairUrl = ({
	path,
	searchParams,
	publicEnv,
}: {
	path: string
	searchParams?: BlockchairSearchParams
	publicEnv: SourcePublicEnv
}) => {
	const url = new URL(firstHttpUrlForBinding(binding))
	url.pathname = path
	for (const [key, value] of Object.entries(searchParams ?? {})) {
		if (value != null) url.searchParams.set(key, String(value))
	}
	const apiKey = optionalPublicEnvString(publicEnv, 'PUBLIC_BLOCKCHAIR_API_KEY')
	if (apiKey != null) url.searchParams.set('key', apiKey)
	return url.toString()
}

export const getBlockchairJson = <_Response>({
	path,
	searchParams,
	publicEnv,
}: {
	path: string
	searchParams?: BlockchairSearchParams
	publicEnv: SourcePublicEnv
}) => (
	sourceGetJson<_Response>(
		binding,
		blockchairUrl({
			path,
			searchParams,
			publicEnv,
		})
	)
)

/**
 * Blockchair REST API v2 JSON over HTTP.
 *
 * @see https://blockchair.com/api/docs
 * @see https://github.com/Blockchair/Blockchair.Support/blob/master/API.md
 */

import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Blockchair/bindings.ts'
import type { BlockchairRequestOptions } from '$/sources/Blockchair/Rest/types.ts'
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
	options,
}: {
	path: string
	searchParams?: BlockchairSearchParams
	options?: BlockchairRequestOptions
}) => {
	const url = new URL(firstHttpUrlForBinding(binding))
	url.pathname = path
	for (const [key, value] of Object.entries(searchParams ?? {})) {
		if (value != null) url.searchParams.set(key, String(value))
	}
	const apiKey = options?.apiKey?.trim()
	if (apiKey != null && apiKey !== '') url.searchParams.set('key', apiKey)
	return url.toString()
}

export const getBlockchairJson = <_Response>({
	path,
	searchParams,
	options,
}: {
	path: string
	searchParams?: BlockchairSearchParams
	options?: BlockchairRequestOptions
}) => (
	sourceGetJson<_Response>(
		binding,
		blockchairUrl({
			path,
			searchParams,
			options,
		})
	)
)

/**
 * Blockchair REST API v2 JSON over HTTP.
 *
 * @see https://blockchair.com/api/docs
 * @see https://github.com/Blockchair/Blockchair.Support/blob/master/API.md
 */

import { getJson } from '$/lib/http.ts'
import { blockchairOrigins } from '$/sources/Blockchair/index.ts'
import {
	blockchairRestBaseUrl,
} from '$/sources/Blockchair/Rest/constants.ts'

import type { BlockchairRequestOptions } from '$/sources/Blockchair/Rest/types.ts'

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
	const url = new URL(blockchairRestBaseUrl)
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
	getJson<_Response>(
		blockchairUrl({
			path,
			searchParams,
			options,
		}),
		{
			origins: blockchairOrigins,
		}
	)
)

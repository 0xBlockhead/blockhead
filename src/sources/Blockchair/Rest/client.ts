/**
 * Blockchair REST API v2 JSON over HTTP.
 *
 * @see https://blockchair.com/api/docs
 * @see https://github.com/Blockchair/Blockchair.Support/blob/master/API.md
 */

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

import type { BlockchairRequestOptions } from '$/sources/Blockchair/Rest/types.ts'

export type BlockchairSearchParams = Record<
	string,
	| boolean
	| number
	| string
	| undefined
>

const blockchairRestBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.Blockchair_Rest
		&& binding.target.kind === SourceTargetKind.Global
		&& binding.target.key === 'blockchair'
	))

if (blockchairRestBindings.length !== 1)
	throw new Error('Blockchair_Rest: canonical REST source binding is missing or ambiguous')

const blockchairRestBinding = blockchairRestBindings[0]

const blockchairUrl = ({
	path,
	searchParams,
	options,
}: {
	path: string
	searchParams?: BlockchairSearchParams
	options?: BlockchairRequestOptions
}) => {
	const url = new URL(firstHttpUrlForBinding(blockchairRestBinding))
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
		blockchairRestBinding,
		blockchairUrl({
			path,
			searchParams,
			options,
		})
	)
)

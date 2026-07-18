import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type {
	HederaMirrorNodeAccount,
	HederaMirrorNodeBlock,
	HederaMirrorNodeBlocks,
} from '$/sources/HederaMirrorNode/Rest/types.ts'

export const getAccount = (
	binding: SourceBinding,
	accountId: string
): Promise<HederaMirrorNodeAccount> => {
	if (!/^\d{1,10}\.\d{1,10}\.\d{1,10}$/.test(accountId))
		throw new Error('HederaMirrorNode_Rest: invalid account selector')

	return sourceGetJson<HederaMirrorNodeAccount>(
		binding,
		new URL(
			`/api/v1/accounts/${encodeURIComponent(accountId)}`,
			firstHttpUrlForBinding(binding)
		).toString()
	)
}

export const getBlocks = (
	binding: SourceBinding,
	limit: number
): Promise<HederaMirrorNodeBlocks> => {
	const url = new URL('/api/v1/blocks', firstHttpUrlForBinding(binding))
	url.searchParams.set('limit', String(limit))
	url.searchParams.set('order', 'desc')

	return sourceGetJson<HederaMirrorNodeBlocks>(binding, url.toString())
}

export const getBlock = (
	binding: SourceBinding,
	hashOrNumber: string
): Promise<HederaMirrorNodeBlock> => {
	if (!/^(?:\d{1,10}|(?:0x)?(?:[A-Fa-f0-9]{64}|[A-Fa-f0-9]{96}))$/.test(hashOrNumber))
		throw new Error('HederaMirrorNode_Rest: invalid block selector')

	return sourceGetJson<HederaMirrorNodeBlock>(
		binding,
		new URL(
			`/api/v1/blocks/${encodeURIComponent(hashOrNumber)}`,
			firstHttpUrlForBinding(binding)
		).toString()
	)
}

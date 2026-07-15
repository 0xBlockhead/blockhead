import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type { HederaMirrorNodeBlock } from '$/sources/HederaMirrorNode/Rest/types.ts'

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

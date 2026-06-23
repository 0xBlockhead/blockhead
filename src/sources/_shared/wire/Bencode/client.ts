import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { BencodeRequest } from '$/sources/_shared/wire/Bencode/types.ts'

export const bencodeRequest = (
	binding: SourceBinding,
	request: BencodeRequest
) => ({
	binding,
	request,
})

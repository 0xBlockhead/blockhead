import type { ParamMatcher } from '@sveltejs/kit'

import { ipfsNamespaceFromString } from '$/lib/ipfs.ts'


export const match = ((param: string) => ipfsNamespaceFromString(param) != null) satisfies ParamMatcher

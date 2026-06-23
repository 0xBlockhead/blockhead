import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { BinanceChainExplorerJson } from '$/sources/BinanceChainExplorer/Rest/types.ts'

export const query = (
	binding: SourceBinding,
	path: string
) => (
	getJson<BinanceChainExplorerJson>(binding, path)
)

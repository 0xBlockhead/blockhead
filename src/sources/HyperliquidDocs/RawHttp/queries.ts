import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getText } from '$/sources/_shared/wire/HttpRest/client.ts'

export const getPageText = (binding: SourceBinding, path: string) => (
	getText(binding, path)
)

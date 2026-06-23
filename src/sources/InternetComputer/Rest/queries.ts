import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { InternetComputerJson } from '$/sources/InternetComputer/Rest/types.ts'

export const query = (binding: SourceBinding, path: string) => (
	getJson<InternetComputerJson>(binding, path)
)

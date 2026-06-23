import type { JsonValue } from '$/typescript/JsonValue.ts'

export type WalletProviderRequest = {
	providerKey?: string
	method: string
	params?: readonly JsonValue[]
}

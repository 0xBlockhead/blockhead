import type {
	JsonObject,
	JsonValue,
} from '$/typescript/JsonValue.ts'

export type CashuMintMethodWire = JsonObject & {
	method: string
	unit: string
	method_name?: string
	min_amount?: number
	max_amount?: number
	options?: JsonObject
}

export type CashuNutSettingsWire = JsonObject & {
	disabled?: boolean
	methods?: CashuMintMethodWire[]
	supported?: JsonValue
}

export type CashuMintInfoWire = {
	name?: string
	pubkey?: string
	version?: string
	description?: string
	description_long?: string
	contact?: {
		method: string
		info: string
	}[]
	motd?: string
	icon_url?: string
	urls?: string[]
	tos_url?: string
	time?: number
	nuts?: Record<string, CashuNutSettingsWire>
}

export type CashuMintKeysetWire = {
	id: string
	unit: string
	active: boolean
	input_fee_ppk?: number
	final_expiry?: number | null
}

export type CashuMintKeysetsWire = {
	keysets: CashuMintKeysetWire[]
}

export type CashuMintKeysWire = {
	keysets: {
		id: string
		unit: string
		active: boolean
		input_fee_ppk?: number
		final_expiry?: number | null
		keys: Record<string, string>
	}[]
}

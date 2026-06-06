export type CashuMintInfoWire = {
	name?: string
	pubkey?: string
	version?: string
	description?: string
	description_long?: string
	motd?: string
	icon_url?: string
	tos_url?: string
	time?: number
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
		keys: Record<string, string>
	}[]
}

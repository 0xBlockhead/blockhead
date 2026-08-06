import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Cashu/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type {
	CashuMintInfoWire,
	CashuMintKeysWire,
	CashuMintKeysetsWire,
	CashuMintMethodWire,
	CashuMintKeysetWire,
	CashuNutSettingsWire,
} from '$/sources/Cashu/Mint/Rest/types.ts'
import type {
	JsonObject,
	JsonValue,
} from '$/typescript/JsonValue.ts'

const bindingByMintUrl = Object.fromEntries(
	bindings[Source.CashuMint_Rest].map((binding) => [binding.target.key, binding])
)

const getMintJson = <_Wire>(
	mintUrl: string,
	path: string
) => {
	const binding = bindingByMintUrl[mintUrl]
	if (binding == null)
		throw new Error(`CashuMint_Rest: no binding for mint ${mintUrl}`)

	return sourceGetJson<_Wire>(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}${path}`
	)
}

const fail = (mintUrl: string, message: string): never => {
	throw new Error(`CashuMint_Rest: ${message} for mint ${mintUrl}`)
}

const expectObject = (
	value: JsonValue,
	mintUrl: string,
	envelope: string
): JsonObject => {
	if (value == null || typeof value !== 'object' || Array.isArray(value))
		fail(mintUrl, `malformed ${envelope} response`)

	return value
}

const expectString = (
	value: JsonValue,
	mintUrl: string,
	envelope: string,
	field: string
) => {
	if (typeof value !== 'string')
		fail(mintUrl, `malformed ${envelope} response: ${field} must be a string`)

	return value
}

const expectBoolean = (
	value: JsonValue,
	mintUrl: string,
	envelope: string,
	field: string
) => {
	if (typeof value !== 'boolean')
		fail(mintUrl, `malformed ${envelope} response: ${field} must be a boolean`)

	return value
}

const expectNumber = (
	value: JsonValue,
	mintUrl: string,
	envelope: string,
	field: string
) => {
	if (typeof value !== 'number')
		fail(mintUrl, `malformed ${envelope} response: ${field} must be a number`)

	return value
}

const expectOptionalNumber = (
	value: JsonValue,
	mintUrl: string,
	envelope: string,
	field: string
) => {
	if (value === undefined)
		return undefined

	return expectNumber(value, mintUrl, envelope, field)
}

const expectOptionalNumberOrNull = (
	value: JsonValue,
	mintUrl: string,
	envelope: string,
	field: string
) => {
	if (value === undefined || value === null)
		return value

	return expectNumber(value, mintUrl, envelope, field)
}

const validateMintMethod = (
	value: JsonValue,
	mintUrl: string,
	envelope: string
): CashuMintMethodWire => {
	const method = expectObject(value, mintUrl, envelope)

	return {
		method: expectString(method.method, mintUrl, envelope, 'method'),
		unit: expectString(method.unit, mintUrl, envelope, 'unit'),
		...(method.method_name !== undefined && {
			method_name: expectString(method.method_name, mintUrl, envelope, 'method_name'),
		}),
		...(method.min_amount !== undefined && {
			min_amount: expectNumber(method.min_amount, mintUrl, envelope, 'min_amount'),
		}),
		...(method.max_amount !== undefined && {
			max_amount: expectNumber(method.max_amount, mintUrl, envelope, 'max_amount'),
		}),
		...(method.options !== undefined && {
			options: expectObject(method.options, mintUrl, envelope),
		}),
	}
}

const validateNutSettings = (
	value: JsonValue,
	mintUrl: string,
	envelope: string
): CashuNutSettingsWire => {
	const settings = expectObject(value, mintUrl, envelope)

	return {
		...(settings.disabled !== undefined && {
			disabled: expectBoolean(settings.disabled, mintUrl, envelope, 'disabled'),
		}),
		...(settings.methods !== undefined && {
			methods: Array.isArray(settings.methods) ?
				settings.methods.map((method) => validateMintMethod(method, mintUrl, envelope))
			:
				fail(mintUrl, `malformed ${envelope} response: methods must be an array`),
		}),
		...(settings.supported !== undefined && {
			supported: settings.supported,
		}),
		...(settings.options !== undefined && {
			options: expectObject(settings.options, mintUrl, envelope),
		}),
	}
}

const validateMintInfo = (
	value: JsonValue,
	mintUrl: string
): CashuMintInfoWire => {
	const info = expectObject(value, mintUrl, 'mint info')
	if (
		info.name === undefined
		&& info.pubkey === undefined
		&& info.version === undefined
		&& info.description === undefined
		&& info.description_long === undefined
		&& info.contact === undefined
		&& info.motd === undefined
		&& info.icon_url === undefined
		&& info.urls === undefined
		&& info.tos_url === undefined
		&& info.time === undefined
		&& info.nuts === undefined
	)
		fail(mintUrl, 'unsupported mint info response')

	return {
		...(info.name !== undefined && {
			name: expectString(info.name, mintUrl, 'mint info', 'name'),
		}),
		...(info.pubkey !== undefined && {
			pubkey: expectString(info.pubkey, mintUrl, 'mint info', 'pubkey'),
		}),
		...(info.version !== undefined && {
			version: expectString(info.version, mintUrl, 'mint info', 'version'),
		}),
		...(info.description !== undefined && {
			description: expectString(info.description, mintUrl, 'mint info', 'description'),
		}),
		...(info.description_long !== undefined && {
			description_long: expectString(info.description_long, mintUrl, 'mint info', 'description_long'),
		}),
		...(info.contact !== undefined && {
			contact: Array.isArray(info.contact) ?
				info.contact.map((contact) => {
					const entry = expectObject(contact, mintUrl, 'mint info')

					return {
						method: expectString(entry.method, mintUrl, 'mint info', 'contact.method'),
						info: expectString(entry.info, mintUrl, 'mint info', 'contact.info'),
					}
				})
			:
				fail(mintUrl, 'malformed mint info response: contact must be an array'),
		}),
		...(info.motd !== undefined && {
			motd: expectString(info.motd, mintUrl, 'mint info', 'motd'),
		}),
		...(info.icon_url !== undefined && {
			icon_url: expectString(info.icon_url, mintUrl, 'mint info', 'icon_url'),
		}),
		...(info.urls !== undefined && {
			urls: Array.isArray(info.urls) ?
				info.urls.map((url, index) => expectString(url, mintUrl, 'mint info', `urls[${index}]`))
			:
				fail(mintUrl, 'malformed mint info response: urls must be an array'),
		}),
		...(info.tos_url !== undefined && {
			tos_url: expectString(info.tos_url, mintUrl, 'mint info', 'tos_url'),
		}),
		...(info.time !== undefined && {
			time: expectNumber(info.time, mintUrl, 'mint info', 'time'),
		}),
		...(info.nuts !== undefined && {
			nuts: (() => {
				const nuts = expectObject(info.nuts, mintUrl, 'mint info')
				const validatedNuts: Record<string, CashuNutSettingsWire> = {}

				for (const [nutKey, nutValue] of Object.entries(nuts))
					validatedNuts[nutKey] = validateNutSettings(nutValue, mintUrl, 'mint info')

				return validatedNuts
			})(),
		}),
	}
}

const validateMintKeyset = (
	value: JsonValue,
	mintUrl: string,
	envelope: 'mint keysets' | 'mint keys'
): CashuMintKeysetWire => {
	const keyset = expectObject(value, mintUrl, envelope)

	return {
		id: expectString(keyset.id, mintUrl, envelope, 'id'),
		unit: expectString(keyset.unit, mintUrl, envelope, 'unit'),
		active: expectBoolean(keyset.active, mintUrl, envelope, 'active'),
		...(keyset.input_fee_ppk !== undefined && {
			input_fee_ppk: expectOptionalNumber(keyset.input_fee_ppk, mintUrl, envelope, 'input_fee_ppk'),
		}),
		...(keyset.final_expiry !== undefined && {
			final_expiry: expectOptionalNumberOrNull(keyset.final_expiry, mintUrl, envelope, 'final_expiry'),
		}),
	}
}

const validateMintKeysets = (
	value: JsonValue,
	mintUrl: string
): CashuMintKeysetsWire => {
	const response = expectObject(value, mintUrl, 'mint keysets')
	if (!Array.isArray(response.keysets))
		fail(mintUrl, 'malformed mint keysets response: keysets must be an array')

	return {
		keysets: response.keysets.map((keyset) => validateMintKeyset(keyset, mintUrl, 'mint keysets')),
	}
}

const validateMintKeys = (
	value: JsonValue,
	mintUrl: string
): CashuMintKeysWire => {
	const response = expectObject(value, mintUrl, 'mint keys')
	if (!Array.isArray(response.keysets))
		fail(mintUrl, 'malformed mint keys response: keysets must be an array')

	return {
		keysets: response.keysets.map((keyset) => {
			const baseKeyset = validateMintKeyset(keyset, mintUrl, 'mint keys')
			const keysetObject = expectObject(keyset, mintUrl, 'mint keys')
			const keys = expectObject(keysetObject.keys, mintUrl, 'mint keys')
			const validatedKeys: Record<string, string> = {}

			for (const [amount, publicKey] of Object.entries(keys))
				validatedKeys[amount] = expectString(publicKey, mintUrl, 'mint keys', `keys.${amount}`)

			return {
				...baseKeyset,
				keys: validatedKeys,
			}
		}),
	}
}

export const getMintInfo = (mintUrl: string) => getMintJson<JsonValue>(mintUrl, '/v1/info').then((response) => validateMintInfo(response, mintUrl))

export const getMintKeysets = (
	mintUrl: string
) => getMintJson<JsonValue>(mintUrl, '/v1/keysets').then((response) => validateMintKeysets(response, mintUrl))

export const getMintKeys = (
	mintUrl: string
) => getMintJson<JsonValue>(mintUrl, '/v1/keys').then((response) => validateMintKeys(response, mintUrl))

export const getMintKeysForKeyset = (
	mintUrl: string,
	{
		keysetId,
	}: {
		keysetId: string
	}
) => getMintJson<JsonValue>(mintUrl, `/v1/keys/${encodeURIComponent(keysetId)}`).then((response) => validateMintKeys(response, mintUrl))

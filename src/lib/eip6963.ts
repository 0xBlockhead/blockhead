import {
	type Eip1193Provider,
	isEip1193Provider,
} from '$/lib/eip1193.ts'

export type Eip6963ProviderInfo = Readonly<{
	uuid: string
	name: string
	icon: string
	rdns: string
}>

export type Eip6963ProviderDetail = {
	info: Eip6963ProviderInfo
	provider: Eip1193Provider
}

declare global {
	interface Window {
		ethereum?: Eip1193Provider
	}
}

const EIP6963_ANNOUNCE_PROVIDER_EVENT = 'eip6963:announceProvider'
const EIP6963_REQUEST_PROVIDER_EVENT = 'eip6963:requestProvider'
const LEGACY_INJECTED_PROVIDER_RDNS = 'legacy.injected.provider'

const eip6963ProvidersByRdns = new Map<string, Eip6963ProviderDetail>()
const eip6963Listeners = new Set<(providers: Eip6963ProviderDetail[]) => void>()

let isEip6963DiscoveryInstalled = false
let legacyInjectedFallbackTimeout: number | null = null

const isRecord = (value: unknown): value is Record<string, unknown> => (
	typeof value === 'object'
	&& value != null
)

const normalizeEip6963ProviderDetail = (
	value: unknown,
): Eip6963ProviderDetail | null => {
	if (!isRecord(value)) return null

	const info = value.info
	const provider = value.provider

	if (!isRecord(info) || !isEip1193Provider(provider)) return null

	return (
		typeof info.uuid === 'string'
		&& info.uuid !== ''
		&& typeof info.name === 'string'
		&& info.name !== ''
		&& typeof info.rdns === 'string'
		&& info.rdns !== '' ?
			{
				info: {
					uuid: info.uuid,
					name: info.name,
					icon:
						typeof info.icon === 'string' ?
							info.icon
						:
							'',
					rdns: info.rdns,
				},
				provider,
			}
		:
			null
	)
}

const getLegacyInjectedProviderDetail = (): Eip6963ProviderDetail | null => (
	typeof window === 'undefined'
	|| !isEip1193Provider(window.ethereum) ?
		null
	:
		{
			info: {
				uuid: LEGACY_INJECTED_PROVIDER_RDNS,
				name: 'Injected provider',
				icon: '',
				rdns: LEGACY_INJECTED_PROVIDER_RDNS,
			},
			provider: window.ethereum,
		}
)

const emitEip6963Providers = () => {
	const providers = [...eip6963ProvidersByRdns.values()]

	for (const listener of eip6963Listeners)
		listener(providers)
}

const upsertEip6963Provider = (detail: Eip6963ProviderDetail) => {
	if (detail.info.rdns !== LEGACY_INJECTED_PROVIDER_RDNS)
		eip6963ProvidersByRdns.delete(LEGACY_INJECTED_PROVIDER_RDNS)

	eip6963ProvidersByRdns.set(detail.info.rdns, detail)
	emitEip6963Providers()
}

const scheduleLegacyInjectedFallback = () => {
	if (typeof window === 'undefined' || legacyInjectedFallbackTimeout != null) return

	legacyInjectedFallbackTimeout = window.setTimeout(() => {
		legacyInjectedFallbackTimeout = null

		if (eip6963ProvidersByRdns.size > 0) return

		const legacyInjectedProvider = getLegacyInjectedProviderDetail()

		if (legacyInjectedProvider)
			upsertEip6963Provider(legacyInjectedProvider)
	}, 0)
}

const onEip6963ProviderAnnounce = (event: Event) => {
	if (!(event instanceof CustomEvent)) return

	const detail = normalizeEip6963ProviderDetail(event.detail)

	if (detail)
		upsertEip6963Provider(detail)
}

const ensureEip6963ProviderDiscovery = () => {
	if (typeof window === 'undefined' || isEip6963DiscoveryInstalled) return

	isEip6963DiscoveryInstalled = true

	window.addEventListener(
		EIP6963_ANNOUNCE_PROVIDER_EVENT,
		onEip6963ProviderAnnounce,
	)
	window.dispatchEvent(new Event(EIP6963_REQUEST_PROVIDER_EVENT))
	scheduleLegacyInjectedFallback()
}

export const subscribeEip6963Providers = (
	listener: (providers: Eip6963ProviderDetail[]) => void,
) => {
	if (typeof window === 'undefined') return () => {}

	ensureEip6963ProviderDiscovery()
	eip6963Listeners.add(listener)
	listener([...eip6963ProvidersByRdns.values()])

	return () => {
		eip6963Listeners.delete(listener)
	}
}

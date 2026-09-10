import { vi } from 'vitest'

import type { JsonValue } from '$/typescript/JsonValue.ts'

export const createInjectedDiscoveryFixture = <_AnnouncementDetail>() => {
	const windowListeners = new Map<string, (event: { detail: _AnnouncementDetail }) => void>()
	const providerListeners = new Map<string, (payload: JsonValue) => void>()
	vi.stubGlobal('window', {
		addEventListener: (event: string, listener: (event: { detail: _AnnouncementDetail }) => void) => windowListeners.set(event, listener),
		removeEventListener: (event: string) => windowListeners.delete(event),
		dispatchEvent: () => true,
		setTimeout,
		clearTimeout,
	})
	return { windowListeners, providerListeners }
}

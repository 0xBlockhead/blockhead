import { expect, it } from 'vitest'

import { GET } from './+server.ts'

it('derives the TonConnect manifest from trusted request URL origins', async () => {
	for (const origin of ['http://127.0.0.1:5193', 'https://blockhead.info', 'https://alternate.example']) {
		const event = {
			request: new Request(`${origin}/tonconnect-manifest.json`, {
				headers: {
					origin: 'https://injected.example',
					'x-forwarded-host': 'injected.example',
				},
			}),
			url: new URL('/tonconnect-manifest.json', origin),
		}
		const response = await GET(event)
		expect(response.headers.get('access-control-allow-origin')).toBe('*')
		expect(await response.json()).toEqual({
			url: origin,
			name: 'Blockhead',
			iconUrl: `${origin}/favicon.png`,
		})
	}
})

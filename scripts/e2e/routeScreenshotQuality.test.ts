import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { routeScreenshotQuality } from '../../tests/_routeScreenshotQuality.ts'


const validInput = {
	boundaryEvents: [],
	contentHeight: 900,
	mainText: 'Ethereum Mainnet',
	overflow: {
		carouselX: 0,
		pageX: 0,
		pageY: 0,
	},
	settled: {
		empty: false,
		failed: [],
		loading: [],
	},
} as const

describe('route screenshot quality', () => {
	it('accepts settled content and keeps visual smells non-fatal', () => {
		assert.deepEqual(routeScreenshotQuality({
			...validInput,
			mainText: 'Content 1712345678901 (3/0) This section does not apply to this entity.',
		}), {
			failures: [],
			warnings: [
				'contains not-applicable sections',
				'shows raw millisecond timestamps',
				'shows ambiguous count notation',
			],
		})
	})

	it('surfaces every fatal signal found by the screenshot corpus', () => {
		const quality = routeScreenshotQuality({
			boundaryEvents: [
				{ kind: 'console-failed' },
				{ kind: 'console-uncaught' },
				{ kind: 'dom-failed' },
			],
			contentHeight: 100,
			mainText: '404 Route selector not applicable\nNo records received.',
			overflow: {
				carouselX: 3,
				pageX: 1,
				pageY: 2,
			},
			settled: {
				empty: true,
				failed: [{}],
				loading: [{}],
			},
		})

		assert.deepEqual(quality.failures, [
			'1 loading boundaries',
			'1 failed boundaries',
			'empty main boundary',
			'boundary events: console-failed, console-uncaught, dom-failed',
			'route selector not applicable',
			'concise empty page',
			'capture height is 100px',
			'capture overflow: pageX=1, pageY=2, carouselX=3',
		])
	})

	for (const [mainText, failure] of [
		['500 Internal Error', 'internal route error'],
		['Loading...', 'main is still loading'],
		['This section does not apply to this entity.', 'concise not-applicable page'],
	] as const) {
		it(`rejects ${failure}`, () => {
			assert(routeScreenshotQuality({
				...validInput,
				contentHeight: 320,
				mainText,
			}).failures.includes(failure))
		})
	}
})

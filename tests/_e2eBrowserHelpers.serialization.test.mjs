import assert from 'node:assert/strict'
import test from 'node:test'
import vm from 'node:vm'

import {
	installBoundaryProbe,
	snapshotBoundaryMain,
} from './_e2eBrowserHelpers.ts'


test('boundary probe init callback is self-contained after tsx serialization', async () => {
	let callbackSource
	await installBoundaryProbe({
		addInitScript(callback) {
			callbackSource = callback.toString()
		},
	})

	assert.doesNotMatch(callbackSource, /\b__name\s*\(/)
	assert.doesNotThrow(() => {
		new vm.Script(`(${callbackSource})()`).runInNewContext({
			console,
			document: {
				querySelector() {
					return null
				},
			},
			MutationObserver: class {
				disconnect() {}

				observe() {}
			},
			WeakMap,
			Map,
			window: {},
		})
	})
})

test('boundary snapshot callback is self-contained after tsx serialization', async () => {
	let callbackSource
	await snapshotBoundaryMain({
		evaluate(callback) {
			callbackSource = callback.toString()
		},
	})

	assert.doesNotMatch(callbackSource, /\b__name\s*\(/)
})

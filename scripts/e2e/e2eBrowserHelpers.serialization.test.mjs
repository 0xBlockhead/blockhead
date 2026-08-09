import assert from 'node:assert/strict'
import test from 'node:test'
import vm from 'node:vm'

import {
	installBoundaryProbe,
	snapshotBoundaryMain,
	waitForBoundarySettle,
} from '../../tests/_e2eBrowserHelpers.ts'


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

test('semantic settlement waits through a stable initial render', async () => {
	let semanticSnapshotIndex = 0
	const semanticSnapshots = [
		{
			ready: false,
			unmet: ['entity-row-count=0/5'],
			signature: 'rows=0',
		},
		{
			ready: true,
			unmet: [],
			signature: 'rows=5',
		},
	]
	const page = {
		evaluate(callback, requirements) {
			if (requirements != null)
				return semanticSnapshots[Math.min(semanticSnapshotIndex++, semanticSnapshots.length - 1)]

			if (callback.toString().includes('__blockheadBoundaryProbe'))
				return 0

			return {
				failed: [],
				loading: [],
				empty: false,
				emptyReason: null,
				textLength: 24,
				contentMarkerCount: 1,
			}
		},
		isClosed() {
			return false
		},
		waitForTimeout() {
			return Promise.resolve()
		},
	}

	const snapshot = await waitForBoundarySettle(page, {
		timeoutMs: 100,
		quietMs: 0,
		semanticReadiness: {
			minimumEntityRows: 5,
		},
	})

	assert.equal(snapshot.empty, false)
	assert.ok(semanticSnapshotIndex >= 2)
})

test('semantic settlement fails closed with unmet acceptance details', async () => {
	const page = {
		evaluate(callback, requirements) {
			if (requirements != null)
				return {
					ready: false,
					unmet: ['link-count=3/8'],
					signature: 'links=3',
				}

			if (callback.toString().includes('__blockheadBoundaryProbe'))
				return 0

			return {
				failed: [],
				loading: [],
				empty: false,
				emptyReason: null,
				textLength: 24,
				contentMarkerCount: 1,
			}
		},
		isClosed() {
			return false
		},
		waitForTimeout() {
			return new Promise((resolve) => setTimeout(resolve, 1))
		},
	}

	const snapshot = await waitForBoundarySettle(page, {
		timeoutMs: 2,
		quietMs: 0,
		semanticReadiness: {
			minimumLinks: 8,
		},
	})

	assert.equal(snapshot.empty, true)
	assert.equal(snapshot.emptyReason, 'semantic-readiness-timeout:link-count=3/8')
})

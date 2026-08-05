import assert from 'node:assert/strict'
import { delimiter } from 'node:path'
import test from 'node:test'

import {
	classifyWallet,
	parseExtensionDirectories,
} from './harness.ts'


test('parses platform-delimited extension directories', () => {
	assert.deepEqual(parseExtensionDirectories(`/one${delimiter}/two`), [
		'/one',
		'/two',
	])
	assert.deepEqual(parseExtensionDirectories(undefined), [])
})

test('classifies supported wallets without treating the fixture as real', () => {
	const manifest = (name: string) => ({
		background: {
			service_worker: 'background.js',
		},
		manifest_version: 3 as const,
		name,
		version: '1.0.0',
	})

	assert.equal(classifyWallet(manifest('MetaMask')), 'metamask')
	assert.equal(classifyWallet(manifest('Rabby Wallet')), 'rabby')
	assert.equal(classifyWallet(manifest('Ambire Wallet')), 'ambire')
	assert.equal(classifyWallet(manifest('Backpack')), 'backpack')
	assert.equal(classifyWallet(manifest('Taho')), 'taho')
	assert.equal(classifyWallet(manifest('UniSat Wallet')), 'unisat')
	assert.equal(classifyWallet(manifest('Zerion Wallet')), 'zerion')
	assert.equal(classifyWallet(manifest('Blockhead Wallet Harness Fixture')), 'harness-only')
	assert.equal(classifyWallet(manifest('Unknown Wallet')), 'unknown')
	assert.equal(classifyWallet({
		...manifest('__MSG_appName__'),
		action: {
			default_title: 'Zerion',
		},
	}), 'zerion')
	assert.equal(classifyWallet({
		...manifest('__MSG_appName__'),
		author: 'https://unisat.io',
	}), 'unisat')
})

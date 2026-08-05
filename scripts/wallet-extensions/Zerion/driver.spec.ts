import assert from 'node:assert/strict'
import test from 'node:test'

import {
	assertWalletMatrixOutcomes,
	runWalletCompatibilityMatrix,
} from '../WalletCompatibilityMatrix.ts'
import {
	zerionDriver,
	zerionTurnstileBlockedObservation,
} from './driver.ts'
import { zerionWalletMatrixScenarios } from './matrix.ts'


test('keeps the Zerion account lifecycle shard free of invented Turnstile CAPTCHA passes', () => {
	assert.equal(zerionDriver.kind, 'zerion')
	assert.deepEqual(zerionWalletMatrixScenarios('1.21.0').map(({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	}) => ({
		id,
		initializationFlow,
		lifecycleEdgeCase,
	})), [
		{
			id: 'zerion-create-new-1',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'turnstile-captcha-blocked',
		},
		{
			id: 'zerion-create-new-2',
			initializationFlow: 'create-new',
			lifecycleEdgeCase: 'turnstile-second-account-blocked',
		},
		{
			id: 'zerion-recover-3',
			initializationFlow: 'recover',
			lifecycleEdgeCase: 'turnstile-recover-blocked',
		},
	])
})

test('declares Zerion Turnstile CAPTCHA onboarding/recover as explicit blocked matrix cells', async () => {
	const scenarios = zerionWalletMatrixScenarios('1.21.0')
	assert.deepEqual(
		scenarios.map((scenario) => zerionTurnstileBlockedObservation(scenario)),
		[
			{
				outcome: 'blocked',
				evidence: {
					code: 'turnstile-captcha-blocked',
					detail: 'Cloudflare Turnstile CAPTCHA blocks unattended Zerion create-new onboarding; completing CAPTCHA is not safe automation',
					source: 'declared-blocker',
				},
			},
			{
				outcome: 'blocked',
				evidence: {
					code: 'turnstile-second-account-blocked',
					detail: 'Zerion second-account creation depends on Turnstile-gated onboarding that is not safe to complete unattended',
					source: 'declared-blocker',
				},
			},
			{
				outcome: 'blocked',
				evidence: {
					code: 'turnstile-recover-blocked',
					detail: 'Zerion recover onboarding is blocked by Cloudflare Turnstile CAPTCHA; completing CAPTCHA is not safe unattended automation',
					source: 'declared-blocker',
				},
			},
		]
	)

	await assertWalletMatrixOutcomes(
		await runWalletCompatibilityMatrix({
			driver: {
				kind: 'zerion',
				run: async (scenario) => zerionTurnstileBlockedObservation(scenario),
			},
			scenarios,
		}),
		[
			'blocked',
			'blocked',
			'blocked',
		],
		'zerion turnstile honesty'
	)
})

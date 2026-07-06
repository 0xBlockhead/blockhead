import type { Page, TestInfo } from '@playwright/test'

import {
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'


const envMs = (
	value: string | undefined,
	fallback: number
) => {
	const trimmed = value?.trim()
	if (!trimmed) return fallback
	const parsed = Number(trimmed)
	return Number.isFinite(parsed) ? parsed : fallback
}


/** Override via `E2E_*_MS` when cold SQLite/OPFS needs longer first paint than default smoke budgets. */
export const routeViewSmokeTimeoutsMs = {
	goto: envMs(process.env.E2E_GOTO_MS, 28_000),
	mainSelector: envMs(process.env.E2E_MAIN_MS, 72_000),
	test: envMs(process.env.E2E_TEST_MS, 92_000),
} as const


/**
 * Route-smoke diagnostic profile: fail fast on app runtime errors, Vite HMR contamination,
 * and TanStack DB query warnings; attach browser/DOM artifacts on failure.
 */
export const setupRouteViewSmokePage = (page: Page) => {
	const diagnostics = setupPageRuntimeDiagnostics(page, {
		failFast: true,
		failOnDevServerContamination: true,
		failOnTanStackWarnings: true,
	})

	return {
		step: diagnostics.step,
		flushArtifacts: (testInfo: TestInfo) => diagnostics.flushArtifacts(testInfo),
		diagnostics,
	}
}

import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import {
	existsSync,
	readFileSync,
} from 'node:fs'
import { matchesGlob } from 'node:path'
import test from 'node:test'

import playwrightConfig from '../../playwright.config.ts'
import walletExtensionsPlaywrightConfig from '../../playwright.wallet-extensions.config.ts'
import viteConfig from '../../vite.config.ts'


const packageJson = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url)))

const trackedTestPathnames = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
	cwd: new URL('../..', import.meta.url),
	encoding: 'utf8',
})
	.split('\n')
	.filter((pathname) => existsSync(new URL(`../../${pathname}`, import.meta.url)))
	.filter((pathname) => /\.(?:test|spec|e2e)\.(?:[cm]?[jt]sx?)$/.test(pathname))

const nodeTestPatterns = Object.values(packageJson.scripts)
	.flatMap((script) => script.split(' --test ').slice(1))
	.flatMap((command) => command.split(/\s+(?:&&|\|\||;)/)[0].trim().split(/\s+/))

const viteProjects = viteConfig.test.projects.map(({ test: config }) => config)
const intentionallyExcludedPatterns = [
	...viteProjects.flatMap(({ exclude }) => exclude),
	...playwrightConfig.testIgnore,
]

test('every tracked test-shaped file is owned by a configured runner or explicit exclusion', () => {
	const undiscovered = trackedTestPathnames.filter((pathname) => (
		!nodeTestPatterns.some((pattern) => matchesGlob(pathname, pattern))
		&& !viteProjects.some((config) => (
			config.include.some((pattern) => matchesGlob(pathname, pattern))
			&& !config.exclude.some((pattern) => matchesGlob(pathname, pattern))
		))
		&& !(
			matchesGlob(pathname, playwrightConfig.testMatch)
			&& !playwrightConfig.testIgnore.some((pattern) => matchesGlob(pathname, pattern))
		)
		&& !matchesGlob(
			pathname,
			`${walletExtensionsPlaywrightConfig.testDir.replace('./', '')}/${walletExtensionsPlaywrightConfig.testMatch}`
		)
		&& !intentionallyExcludedPatterns.some((pattern) => matchesGlob(pathname, pattern))
	))

	assert.deepEqual(undiscovered, [])
})

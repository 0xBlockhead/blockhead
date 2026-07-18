import { page } from 'vitest/browser'
import {
	expect,
	it,
	vi,
} from 'vitest'
import { render } from 'vitest-browser-svelte'

import ApplicationRuntimeFixture from './applicationRuntime.fixture.svelte'


it('shows chrome and bootstrap pending UI before mounting one route child', async () => {
	let resolveClient: ((client: { id: string }) => void) | undefined
	const client = new Promise<{ id: string }>((resolve) => {
		resolveClient = resolve
	})
	const onMount = vi.fn()
	const onDestroy = vi.fn()

	render(ApplicationRuntimeFixture, {
		client,
		onMount,
		onDestroy,
	})

	await expect.element(page.getByRole('navigation', { name: 'Application chrome' })).toBeVisible()
	await expect.element(page.getByText('Loading...')).toBeVisible({
		timeout: 2_000,
	})
	await expect.element(page.getByRole('heading', { name: 'Route child' })).not.toBeInTheDocument()
	expect(onMount).not.toHaveBeenCalled()

	resolveClient?.({ id: 'canonical' })
	await expect.element(page.getByRole('heading', { name: 'Route child' })).toBeVisible()
	expect(onMount).toHaveBeenCalledOnce()
	expect(onMount).toHaveBeenCalledWith('canonical')
	await expect.element(page.getByText('Loading...')).not.toBeInTheDocument()
})

it('renders bootstrap-owned failure diagnostics without mounting a route child', async () => {
	const unhandledRejection = vi.fn()
	window.addEventListener('unhandledrejection', unhandledRejection)
	const onMount = vi.fn()
	const bootstrapFailure = new Error('resolver loading failed')

	render(ApplicationRuntimeFixture, {
		client: Promise.reject(bootstrapFailure),
		onMount,
		onDestroy: vi.fn(),
	})

	const alert = page.getByRole('alert')
	await expect.element(alert).toBeVisible({
		timeout: 2_000,
	})
	expect(alert.element().getAttribute('data-error')).toBe('ApplicationBootstrap')
	await expect.element(page.getByText('resolver loading failed', {
		exact: true,
	})).toBeVisible()
	await expect.element(page.getByRole('heading', { name: 'Route child' })).not.toBeInTheDocument()
	expect(onMount).not.toHaveBeenCalled()
	expect(unhandledRejection).not.toHaveBeenCalled()

	window.removeEventListener('unhandledrejection', unhandledRejection)
})

it('does not mount after browser teardown wins the readiness race', async () => {
	let resolveClient: ((client: { id: string }) => void) | undefined
	const client = new Promise<{ id: string }>((resolve) => {
		resolveClient = resolve
	})
	const onMount = vi.fn()
	const rendered = await render(ApplicationRuntimeFixture, {
		client,
		onMount,
		onDestroy: vi.fn(),
	})

	await rendered.unmount()
	resolveClient?.({ id: 'late' })
	await client
	await Promise.resolve()

	expect(onMount).not.toHaveBeenCalled()
})

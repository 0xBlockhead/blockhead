import { afterEach, expect, test, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'

import { formatRelativeTime, TIMESTAMP_RECENT_MAX_MS } from '$/lib/time.ts'
import Timestamp from '$/components/Timestamp.svelte'


afterEach(() => {
	vi.restoreAllMocks()
})

test('renders a recent timestamp relatively and forwards time attributes', async () => {
	const now = 1_800_000_000_000
	const timestamp = now - 5_000
	vi.spyOn(Date, 'now').mockReturnValue(now)

	const { container } = await render(Timestamp, {
		timestamp,
		'aria-label': 'Observed at',
	})
	const time = container.querySelector('time')

	expect(time?.textContent).toBe(formatRelativeTime(now - timestamp))
	expect(time?.getAttribute('datetime')).toBe(new Date(timestamp).toISOString())
	expect(time?.getAttribute('title')).toBe(new Date(timestamp).toLocaleString())
	expect(time?.getAttribute('aria-label')).toBe('Observed at')
})

test('renders an old timestamp absolutely', async () => {
	const now = 1_800_000_000_000
	const timestamp = now - TIMESTAMP_RECENT_MAX_MS - 1
	vi.spyOn(Date, 'now').mockReturnValue(now)

	const { container } = await render(Timestamp, {
		timestamp,
	})
	const time = container.querySelector('time')

	expect(time?.textContent).toBe(new Date(timestamp).toLocaleString())
	expect(time?.getAttribute('datetime')).toBe(new Date(timestamp).toISOString())
	expect(time?.getAttribute('title')).toBe(formatRelativeTime(now - timestamp))
})

test('renders a dash for null and non-finite timestamps', async () => {
	const rendered = await render(Timestamp, {
		timestamp: null,
	})

	expect(rendered.container.textContent.trim()).toBe('–')
	expect(rendered.container.querySelector('time')).toBeNull()

	await rendered.rerender({
		timestamp: Number.NaN,
	})
	expect(rendered.container.textContent.trim()).toBe('–')
	expect(rendered.container.querySelector('time')).toBeNull()

	await rendered.rerender({
		timestamp: Number.POSITIVE_INFINITY,
	})
	expect(rendered.container.textContent.trim()).toBe('–')
	expect(rendered.container.querySelector('time')).toBeNull()
})

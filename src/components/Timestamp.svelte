<script lang="ts">
	// Types/constants
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { SvelteHTMLElements } from 'svelte/elements'


	// State
	let {
		timestamp,
		...timeProps
	}: WithRest<
		{
			timestamp: number | null | undefined
		},
		SvelteHTMLElements['time']
	> = $props()


	// Inner context
	$effect(() => {
		if (!recent)
			return

		const interval = setInterval(() => {
			now = Date.now()
		}, 1000)

		return () => {
			clearInterval(interval)
		}
	})


	import { formatRelativeTime, TIMESTAMP_RECENT_MAX_MS } from '$/lib/time.ts'

	let now = $state(
		Date.now()
	)


	const finiteTimestamp = $derived(
		timestamp !== null && timestamp !== undefined && Number.isFinite(timestamp) ?
			timestamp
		:
			undefined
	)

	const date = $derived(
		finiteTimestamp !== undefined ?
			new Date(finiteTimestamp)
		:
			undefined
	)

	const isoString = $derived(
		date?.toISOString()
	)

	const absoluteTime = $derived(
		date?.toLocaleString()
	)

	const relativeTime = $derived(
		finiteTimestamp !== undefined ?
			formatRelativeTime(now - finiteTimestamp)
		:
			undefined
	)

	const recent = $derived(
		finiteTimestamp !== undefined
		&& Math.abs(now - finiteTimestamp) <= TIMESTAMP_RECENT_MAX_MS
	)
</script>


{#if finiteTimestamp === undefined}
	–

{:else if recent}
	<time
		{...timeProps}
		datetime={isoString}
		title={absoluteTime}
	>{relativeTime}</time>

{:else}
	<time
		{...timeProps}
		datetime={isoString}
		title={relativeTime}
	>{absoluteTime}</time>
{/if}

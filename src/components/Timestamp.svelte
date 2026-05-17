<script module lang="ts">
	// Types/constants
	export enum TimestampFormat {
		Absolute = 'absolute',
		Relative = 'relative',
		Both = 'both',
	}
</script>


<script lang="ts">
	// Types/constants
	import { formatRelativeTime } from '$/lib/time.ts'


	// Props
	let {
		timestamp,
		format = TimestampFormat.Absolute,
	}: {
		timestamp: number | null | undefined
		format?: TimestampFormat
	} = $props()


	// (Derived)
	const date = $derived(
		timestamp !== undefined && typeof timestamp === 'number' && Number.isFinite(timestamp) ?
			new Date(timestamp)
		:
			undefined
	)
	const isoString = $derived(
		date?.toISOString()
	)
	const absoluteTime = $derived(
		date?.toLocaleString()
	)


	// State
	let now = $state(
		Date.now()
	)


	// (Derived)
	const relativeTime = $derived(
		timestamp !== undefined && typeof timestamp === 'number' && Number.isFinite(timestamp) ?
			formatRelativeTime(now - timestamp)
		:
			undefined
	)


	// Effects
	$effect(() => {
		if (format === TimestampFormat.Relative || format === TimestampFormat.Both) {
			const interval = setInterval(() => {
				now = Date.now()
			}, 1000)

			return () => {
				clearInterval(interval)
			}
		}
	})
</script>


{#if timestamp === undefined || typeof timestamp !== 'number' || !Number.isFinite(timestamp)}
	–

{:else if format === TimestampFormat.Absolute}
	<time
		datetime={isoString}
		title={relativeTime}
	>{absoluteTime}</time>

{:else if format === TimestampFormat.Relative}
	<time
		datetime={isoString}
		title={absoluteTime}
	>{relativeTime}</time>

{:else if format === TimestampFormat.Both}
	<time
		datetime={isoString}
		title={`${absoluteTime} (${relativeTime})`}
	>{absoluteTime} ({relativeTime})</time>
{/if}

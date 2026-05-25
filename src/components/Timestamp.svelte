<script module lang="ts">
	// Types/constants
	export enum TimestampFormat {
		Auto = 'auto',
		Absolute = 'absolute',
		Relative = 'relative',
		Both = 'both',
	}
</script>


<script lang="ts">
	// State
	let {
		timestamp,
		format = TimestampFormat.Auto,
	}: {
		timestamp: number | null | undefined
		format?: TimestampFormat
	} = $props()


	// Inner context
	$effect(() => {
		if (displayFormat === TimestampFormat.Relative || displayFormat === TimestampFormat.Both) {
			const interval = setInterval(() => {
				now = Date.now()
			}, 1000)

			return () => {
				clearInterval(interval)
			}
		}
	})


	// State
	import { formatRelativeTime, TIMESTAMP_RECENT_MAX_MS } from '$/lib/time.ts'

	let now = $state(
		Date.now()
	)


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

	const relativeTime = $derived(
		timestamp !== undefined && typeof timestamp === 'number' && Number.isFinite(timestamp) ?
			formatRelativeTime(now - timestamp)
		:
			undefined
	)

	const displayFormat = $derived(
		format === TimestampFormat.Auto ?
			(
				timestamp !== undefined && typeof timestamp === 'number' && Number.isFinite(timestamp)
				&& Math.abs(now - timestamp) <= TIMESTAMP_RECENT_MAX_MS ?
					TimestampFormat.Relative
				:
					TimestampFormat.Absolute
			)
		:
			format
	)
</script>


{#if timestamp === undefined || typeof timestamp !== 'number' || !Number.isFinite(timestamp)}
	–

{:else if displayFormat === TimestampFormat.Absolute}
	<time
		datetime={isoString}
		title={relativeTime}
	>{absoluteTime}</time>

{:else if displayFormat === TimestampFormat.Relative}
	<time
		datetime={isoString}
		title={absoluteTime}
	>{relativeTime}</time>

{:else if displayFormat === TimestampFormat.Both}
	<time
		datetime={isoString}
		title={`${absoluteTime} (${relativeTime})`}
	>{absoluteTime} ({relativeTime})</time>
{/if}

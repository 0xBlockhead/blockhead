<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/swap/quote/[source=stringSegment]/[quoteRequestHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]',
			{
				source: params.source,
				quoteRequestHash: params.quoteRequestHash,
				timestampMs: params.timestampMs,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.SwapQuote_Timestamp, data.selector))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import SwapQuote_TimestampView from '$/views/SwapQuote_TimestampView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<SwapQuote_TimestampView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>

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
			'/~/bridge/quote/[source=stringSegment]/[quoteRequestHash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]',
			{
				source: params.source,
				quoteRequestHash: params.quoteRequestHash,
				timestampMs: params.timestampMs,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.BridgeRouteQuote_Timestamp, data.selector))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BridgeRouteQuote_TimestampView from '$/views/BridgeRouteQuote_TimestampView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<BridgeRouteQuote_TimestampView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>

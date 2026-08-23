<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AssetFormatSupport_TimestampView from '$/views/AssetFormatSupport_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AssetFormatSupport_Timestamp, {
					$assetInstance: data.selector,
					formatId: params.formatId,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.formatId || 'asset format support timestamp')} • asset format support timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'asset format support timestamp'} • asset format support timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AssetFormatSupport_Timestamp, {
					$assetInstance: data.selector,
					formatId: params.formatId,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<AssetFormatSupport_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AssetSupply_TimestampView from '$/views/AssetSupply_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AssetSupply_Timestamp, {
				$assetInstance: data.selector,
				supplyScopeKey: params.supplyScopeKey,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.supplyScopeKey || 'asset supply timestamp')} • asset supply timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'asset supply timestamp'} • asset supply timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AssetSupply_Timestamp, {
				$assetInstance: data.selector,
				supplyScopeKey: params.supplyScopeKey,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<AssetSupply_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

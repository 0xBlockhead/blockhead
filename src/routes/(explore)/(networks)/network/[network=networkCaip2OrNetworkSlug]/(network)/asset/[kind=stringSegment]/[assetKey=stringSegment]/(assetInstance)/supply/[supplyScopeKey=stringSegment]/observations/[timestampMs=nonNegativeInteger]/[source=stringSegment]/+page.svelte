<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AssetSupply_Timestamp, {
		$assetInstance: data.selector,
		supplyScopeKey: params.supplyScopeKey,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AssetSupply_TimestampView from '$/views/AssetSupply_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.supplyScopeKey || 'asset supply timestamp')} • asset supply timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'asset supply timestamp'} • asset supply timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AssetSupply_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

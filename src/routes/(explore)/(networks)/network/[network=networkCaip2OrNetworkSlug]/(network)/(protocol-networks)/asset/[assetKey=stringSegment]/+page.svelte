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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StellarAsset, {
		$network: data.selector,
		assetKey: params.assetKey,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StellarAssetView from '$/views/StellarAssetView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'stellar asset'} • stellar asset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar asset'} • stellar asset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StellarAssetView
		selection={pageSelection}
	/>
	{/if}
</Page>

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
	import StellarAssetView from '$/views/StellarAssetView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StellarAsset, {
				$network: data.selector,
				assetKey: params.assetKey,
			})}
		<title>{data?.title ?? 'stellar asset'} • stellar asset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'stellar asset'} • stellar asset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StellarAsset, {
				$network: data.selector,
				assetKey: params.assetKey,
			})}

	<StellarAssetView
		selection={pageSelection}
	/>
	{/if}
</Page>

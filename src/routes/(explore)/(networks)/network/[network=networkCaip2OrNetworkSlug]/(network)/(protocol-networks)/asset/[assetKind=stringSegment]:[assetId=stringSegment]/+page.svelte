<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.PolkadotAsset, data.selector, {
		sources: [
			Source.SubstrateSidecar_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotAssetView from '$/views/PolkadotAssetView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.assetId || 'Polkadot asset')} • Polkadot asset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Polkadot asset'} • Polkadot asset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<PolkadotAssetView
		selection={pageSelection}
	/>
	{/if}
</Page>

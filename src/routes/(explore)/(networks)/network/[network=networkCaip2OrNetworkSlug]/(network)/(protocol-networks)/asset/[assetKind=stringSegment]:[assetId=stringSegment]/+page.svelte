<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotAssetView from '$/views/PolkadotAssetView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.PolkadotAsset, data.selector, {
				sources: [
					Source.SubstrateSidecar_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.assetId || 'Polkadot asset')} • Polkadot asset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Polkadot asset'} • Polkadot asset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.PolkadotAsset, data.selector, {
				sources: [
					Source.SubstrateSidecar_Rest,
				],
			})}

	<PolkadotAssetView
		selection={pageSelection}
	/>
	{/if}
</Page>

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
	import CardanoTxOutputAssetView from '$/views/CardanoTxOutputAssetView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoTxOutputAsset, {
				$output: data.selector,
				$asset: {
					$network: data.selector.$transaction.$network,
					policyId: params.policyId,
					assetName: params.assetName,
				},
			})}
		<title>{data?.title ?? 'Cardano transaction output asset'} • Cardano transaction output asset • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano transaction output asset'} • Cardano transaction output asset • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoTxOutputAsset, {
				$output: data.selector,
				$asset: {
					$network: data.selector.$transaction.$network,
					policyId: params.policyId,
					assetName: params.assetName,
				},
			})}

	<CardanoTxOutputAssetView
		selection={pageSelection}
	/>
	{/if}
</Page>

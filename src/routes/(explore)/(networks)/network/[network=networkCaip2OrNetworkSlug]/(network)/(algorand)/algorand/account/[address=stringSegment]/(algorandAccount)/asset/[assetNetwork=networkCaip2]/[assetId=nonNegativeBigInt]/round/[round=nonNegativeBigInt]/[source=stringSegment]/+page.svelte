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
	import AlgorandAssetHolding_RoundView from '$/views/AlgorandAssetHolding_RoundView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AlgorandAssetHolding_Round, {
					$account: data.selector,
					$asset: {
						$network: {
							$network: {
								caip2: params.assetNetwork,
							},
						},
						assetId: BigInt(params.assetId),
					},
					round: BigInt(params.round),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'algorand asset holding round'} • algorand asset holding round • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'algorand asset holding round'} • algorand asset holding round • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AlgorandAssetHolding_Round, {
					$account: data.selector,
					$asset: {
						$network: {
							$network: {
								caip2: params.assetNetwork,
							},
						},
						assetId: BigInt(params.assetId),
					},
					round: BigInt(params.round),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<AlgorandAssetHolding_RoundView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

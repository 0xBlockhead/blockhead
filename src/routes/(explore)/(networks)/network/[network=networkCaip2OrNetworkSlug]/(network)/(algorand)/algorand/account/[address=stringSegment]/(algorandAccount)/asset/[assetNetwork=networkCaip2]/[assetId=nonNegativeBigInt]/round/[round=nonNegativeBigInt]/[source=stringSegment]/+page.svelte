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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AlgorandAssetHolding_Round, {
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
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandAssetHolding_RoundView from '$/views/AlgorandAssetHolding_RoundView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'algorand asset holding round'} • algorand asset holding round • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand asset holding round'} • algorand asset holding round • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AlgorandAssetHolding_RoundView
		selection={pageSelection}
	/>
	{/if}
</Page>

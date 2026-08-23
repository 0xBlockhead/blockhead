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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EigenLayerDelegation_Timestamp, {
		$staker: {
			$network: data.selector.$network,
			$actor: {
				address: params.stakerAddress,
			},
		},
		$operator: data.selector,
		$strategy: {
			$network: data.selector.$network,
			strategyAddress: params.strategyAddress,
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EigenLayerDelegation_TimestampView from '$/views/EigenLayerDelegation_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'eigen layer delegation timestamp'} • eigen layer delegation timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'eigen layer delegation timestamp'} • eigen layer delegation timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EigenLayerDelegation_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

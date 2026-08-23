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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EigenLayerAllocation_Timestamp, {
		$operator: data.selector,
		$avs: {
			$network: data.selector.$network,
			avsAddress: params.avsAddress,
		},
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
	import EigenLayerAllocation_TimestampView from '$/views/EigenLayerAllocation_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'eigen layer allocation timestamp'} • eigen layer allocation timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'eigen layer allocation timestamp'} • eigen layer allocation timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EigenLayerAllocation_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

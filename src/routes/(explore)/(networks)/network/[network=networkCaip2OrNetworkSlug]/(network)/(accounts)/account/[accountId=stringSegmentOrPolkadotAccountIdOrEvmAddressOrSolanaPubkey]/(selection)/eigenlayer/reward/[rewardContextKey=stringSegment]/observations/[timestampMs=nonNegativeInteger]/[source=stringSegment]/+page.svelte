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
	import EigenLayerReward_TimestampView from '$/views/EigenLayerReward_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EigenLayerReward_Timestamp, {
				$earner: data.selector,
				rewardContextKey: params.rewardContextKey,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'eigen layer reward timestamp'} • eigen layer reward timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'eigen layer reward timestamp'} • eigen layer reward timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EigenLayerReward_Timestamp, {
				$earner: data.selector,
				rewardContextKey: params.rewardContextKey,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<EigenLayerReward_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

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
	import QuilibriumShardView from '$/views/QuilibriumShardView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.QuilibriumShard, data.selector, {
				sources: [
					Source.QuilibriumNode_Grpc,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.shardKey || 'quilibrium shard')} • quilibrium shard • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'quilibrium shard'} • quilibrium shard • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.QuilibriumShard, data.selector, {
				sources: [
					Source.QuilibriumNode_Grpc,
				],
			})}

	<QuilibriumShardView
		selection={pageSelection}
	/>
	{/if}
</Page>

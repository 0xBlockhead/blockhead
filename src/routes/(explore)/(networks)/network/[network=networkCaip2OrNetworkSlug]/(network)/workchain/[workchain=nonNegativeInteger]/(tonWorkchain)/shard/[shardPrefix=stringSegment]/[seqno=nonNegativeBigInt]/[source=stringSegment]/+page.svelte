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
	import TonShard_TimestampView from '$/views/TonShard_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TonShard_Timestamp, {
				$workchain: data.selector,
				shardPrefix: params.shardPrefix,
				seqno: BigInt(params.seqno),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'TON shard timestamp'} • TON shard timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'TON shard timestamp'} • TON shard timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TonShard_Timestamp, {
				$workchain: data.selector,
				shardPrefix: params.shardPrefix,
				seqno: BigInt(params.seqno),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<TonShard_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

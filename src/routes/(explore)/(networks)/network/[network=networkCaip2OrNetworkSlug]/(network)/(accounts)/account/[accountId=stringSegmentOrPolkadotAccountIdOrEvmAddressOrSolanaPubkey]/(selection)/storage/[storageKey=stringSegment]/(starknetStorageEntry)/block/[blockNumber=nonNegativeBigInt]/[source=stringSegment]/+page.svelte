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
	import StarknetStorageEntry_TimestampView from '$/views/StarknetStorageEntry_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StarknetStorageEntry_Timestamp, {
				$entry: data.selector,
				blockNumber: BigInt(params.blockNumber),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'starknet storage entry timestamp'} • starknet storage entry timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'starknet storage entry timestamp'} • starknet storage entry timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StarknetStorageEntry_Timestamp, {
				$entry: data.selector,
				blockNumber: BigInt(params.blockNumber),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<StarknetStorageEntry_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

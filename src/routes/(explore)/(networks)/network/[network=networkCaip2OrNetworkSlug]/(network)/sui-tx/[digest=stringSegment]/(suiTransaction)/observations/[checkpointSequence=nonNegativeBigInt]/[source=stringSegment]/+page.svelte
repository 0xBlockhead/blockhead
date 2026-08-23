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
	import SuiTransaction_TimestampView from '$/views/SuiTransaction_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiTransaction_Timestamp, {
				$transaction: data.selector,
				checkpointSequence: BigInt(params.checkpointSequence),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'Sui transaction timestamp'} • Sui transaction timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui transaction timestamp'} • Sui transaction timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiTransaction_Timestamp, {
				$transaction: data.selector,
				checkpointSequence: BigInt(params.checkpointSequence),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<SuiTransaction_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

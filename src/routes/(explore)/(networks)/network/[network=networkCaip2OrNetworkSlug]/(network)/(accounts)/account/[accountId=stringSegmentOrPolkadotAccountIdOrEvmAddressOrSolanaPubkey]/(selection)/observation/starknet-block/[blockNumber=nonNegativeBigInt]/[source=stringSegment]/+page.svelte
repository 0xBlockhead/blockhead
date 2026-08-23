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
	import StarknetAccount_TimestampView from '$/views/StarknetAccount_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StarknetAccount_Timestamp, {
				$contract: data.selector,
				blockNumber: BigInt(params.blockNumber),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'starknet account timestamp'} • starknet account timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'starknet account timestamp'} • starknet account timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.StarknetAccount_Timestamp, {
				$contract: data.selector,
				blockNumber: BigInt(params.blockNumber),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<StarknetAccount_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

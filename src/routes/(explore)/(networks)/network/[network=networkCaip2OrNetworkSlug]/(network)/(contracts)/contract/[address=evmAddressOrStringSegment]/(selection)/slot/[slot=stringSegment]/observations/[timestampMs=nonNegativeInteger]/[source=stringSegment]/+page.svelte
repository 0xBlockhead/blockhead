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
	import HederaContractState_TimestampView from '$/views/HederaContractState_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaContractState_Timestamp, {
				$contract: data.selector,
				slot: params.slot,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'hedera contract state timestamp'} • hedera contract state timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera contract state timestamp'} • hedera contract state timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HederaContractState_Timestamp, {
				$contract: data.selector,
				slot: params.slot,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<HederaContractState_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

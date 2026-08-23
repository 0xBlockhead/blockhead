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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.HederaContractState_Timestamp, {
		$contract: data.selector,
		slot: params.slot,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import HederaContractState_TimestampView from '$/views/HederaContractState_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'hedera contract state timestamp'} • hedera contract state timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hedera contract state timestamp'} • hedera contract state timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<HederaContractState_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StarknetTransaction_Timestamp, {
		$transaction: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StarknetTransaction_TimestampView from '$/views/StarknetTransaction_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'starknet transaction timestamp'} • starknet transaction timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'starknet transaction timestamp'} • starknet transaction timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StarknetTransaction_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

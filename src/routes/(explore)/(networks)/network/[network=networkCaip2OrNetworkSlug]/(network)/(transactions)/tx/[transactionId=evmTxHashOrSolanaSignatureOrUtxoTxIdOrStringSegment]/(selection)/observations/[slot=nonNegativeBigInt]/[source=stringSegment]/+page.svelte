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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SolanaTransaction_Timestamp, {
		$transaction: data.selector,
		slot: BigInt(params.slot),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaTransaction_TimestampView from '$/views/SolanaTransaction_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.slot) || 'solana transaction timestamp')} • solana transaction timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'solana transaction timestamp'} • solana transaction timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SolanaTransaction_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

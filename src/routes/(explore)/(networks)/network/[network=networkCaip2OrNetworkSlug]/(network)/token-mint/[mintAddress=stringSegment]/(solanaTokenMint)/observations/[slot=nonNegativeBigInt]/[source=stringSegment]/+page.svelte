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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SolanaTokenMint_Timestamp, {
		$mint: data.selector,
		slot: BigInt(params.slot),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaTokenMint_TimestampView from '$/views/SolanaTokenMint_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.slot) || 'solana token mint timestamp')} • solana token mint timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'solana token mint timestamp'} • solana token mint timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SolanaTokenMint_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

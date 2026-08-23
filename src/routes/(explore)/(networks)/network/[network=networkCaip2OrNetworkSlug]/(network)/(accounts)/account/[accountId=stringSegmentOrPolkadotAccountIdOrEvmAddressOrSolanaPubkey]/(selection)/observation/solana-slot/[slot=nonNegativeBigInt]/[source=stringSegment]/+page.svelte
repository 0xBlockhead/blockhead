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
	import SolanaAccount_TimestampView from '$/views/SolanaAccount_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SolanaAccount_Timestamp, {
				$account: data.selector,
				slot: BigInt(params.slot),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.slot) || 'solana account timestamp')} • solana account timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'solana account timestamp'} • solana account timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SolanaAccount_Timestamp, {
				$account: data.selector,
				slot: BigInt(params.slot),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<SolanaAccount_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

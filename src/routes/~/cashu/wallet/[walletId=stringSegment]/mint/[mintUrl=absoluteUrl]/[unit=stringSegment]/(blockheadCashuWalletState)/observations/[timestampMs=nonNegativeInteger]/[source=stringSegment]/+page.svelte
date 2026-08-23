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
	import BlockheadCashuWalletState_TimestampView from '$/views/BlockheadCashuWalletState_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadCashuWalletState_Timestamp, {
				$walletState: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead Cashu wallet state timestamp')} • blockhead Cashu wallet state timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead Cashu wallet state timestamp'} • blockhead Cashu wallet state timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadCashuWalletState_Timestamp, {
				$walletState: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<BlockheadCashuWalletState_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

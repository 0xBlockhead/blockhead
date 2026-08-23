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
	import BlockheadLitecoinMwebWalletState_TimestampView from '$/views/BlockheadLitecoinMwebWalletState_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLitecoinMwebWalletState_Timestamp, {
				$walletState: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead litecoin mweb wallet state timestamp')} • blockhead litecoin mweb wallet state timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead litecoin mweb wallet state timestamp'} • blockhead litecoin mweb wallet state timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadLitecoinMwebWalletState_Timestamp, {
				$walletState: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<BlockheadLitecoinMwebWalletState_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

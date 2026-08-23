<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import HederaNetworkStake_TimestampView from '$/views/HederaNetworkStake_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HederaNetworkStake_Timestamp, data.selector, {
					sources: [data.selector.source],
				}))}
			<title>{data?.title ?? 'hedera network stake timestamp'} • hedera network stake timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'hedera network stake timestamp'} • hedera network stake timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.HederaNetworkStake_Timestamp, data.selector, {
					sources: [data.selector.source],
				}))}

		<HederaNetworkStake_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

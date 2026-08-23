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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import TonJettonBalance_TimestampView from '$/views/TonJettonBalance_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TonJettonBalance_Timestamp, {
					$account: data.selector,
					$jetton: {
						$network: data.selector.$network,
						masterAddress: params.masterAddress,
					},
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'TON jetton balance timestamp'} • TON jetton balance timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'TON jetton balance timestamp'} • TON jetton balance timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.TonJettonBalance_Timestamp, {
					$account: data.selector,
					$jetton: {
						$network: data.selector.$network,
						masterAddress: params.masterAddress,
					},
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<TonJettonBalance_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

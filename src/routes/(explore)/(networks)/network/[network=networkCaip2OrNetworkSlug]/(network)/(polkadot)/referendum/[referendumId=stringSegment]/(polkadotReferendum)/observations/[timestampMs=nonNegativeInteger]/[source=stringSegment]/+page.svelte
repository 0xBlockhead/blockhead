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
	import PolkadotReferendum_TimestampView from '$/views/PolkadotReferendum_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.PolkadotReferendum_Timestamp, {
					$referendum: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
					fields: {
						status: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Polkadot referendum timestamp' : (pageSelection.entity.status ?? '') || 'Polkadot referendum timestamp')} • Polkadot referendum timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Polkadot referendum timestamp'} • Polkadot referendum timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.PolkadotReferendum_Timestamp, {
					$referendum: data.selector,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
					fields: {
						status: true,
					},
				}))}

		<PolkadotReferendum_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

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
	import CardanoStakePool_TimestampView from '$/views/CardanoStakePool_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CardanoStakePool_Timestamp, {
					$pool: data.selector,
					epoch: Number(params.epoch),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'Cardano stake pool timestamp'} • Cardano stake pool timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Cardano stake pool timestamp'} • Cardano stake pool timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CardanoStakePool_Timestamp, {
					$pool: data.selector,
					epoch: Number(params.epoch),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<CardanoStakePool_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

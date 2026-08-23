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
	import CardanoDRep_TimestampView from '$/views/CardanoDRep_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CardanoDRep_Timestamp, {
					$drep: data.selector,
					epoch: Number(params.epoch),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'Cardano DRep timestamp'} • Cardano DRep timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Cardano DRep timestamp'} • Cardano DRep timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CardanoDRep_Timestamp, {
					$drep: data.selector,
					epoch: Number(params.epoch),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<CardanoDRep_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

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
	import PolkadotEventView from '$/views/PolkadotEventView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.PolkadotEvent, {
					$block: data.selector,
					indexInBlock: Number(params.eventIndex),
				}, {
					fields: {
						eventName: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Event ' + String(pageSelection.entitySelector.indexInBlock ?? '') : [pageSelection.entity.eventName, 'Event ' + String(pageSelection.entitySelector.indexInBlock)].filter(Boolean).join(' ') || 'Polkadot event')} • Polkadot event • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Polkadot event'} • Polkadot event • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.PolkadotEvent, {
					$block: data.selector,
					indexInBlock: Number(params.eventIndex),
				}, {
					fields: {
						eventName: true,
					},
				}))}

		<PolkadotEventView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

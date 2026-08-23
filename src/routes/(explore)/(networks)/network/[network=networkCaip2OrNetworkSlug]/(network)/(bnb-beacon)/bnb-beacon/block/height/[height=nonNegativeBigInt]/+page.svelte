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
	import BnbBeaconBlockView from '$/views/BnbBeaconBlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BnbBeaconBlock, {
					$network: data.selector,
					height: BigInt(params.height),
				}, {
					fields: {
						hash: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.height ?? '') || 'bnb beacon block' : String(pageSelection.entitySelector.height) || pageSelection.entity.hash || 'bnb beacon block')} • bnb beacon block • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'bnb beacon block'} • bnb beacon block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BnbBeaconBlock, {
					$network: data.selector,
					height: BigInt(params.height),
				}, {
					fields: {
						hash: true,
					},
				}))}

		<BnbBeaconBlockView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconBlockView from '$/views/BeaconBlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BeaconBlock, data.selector, {
					sources: [
						Source.Beacon_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.root || 'beacon block')} • beacon block • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'beacon block'} • beacon block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BeaconBlock, data.selector, {
					sources: [
						Source.Beacon_Rest,
					],
				}))}

		<BeaconBlockView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

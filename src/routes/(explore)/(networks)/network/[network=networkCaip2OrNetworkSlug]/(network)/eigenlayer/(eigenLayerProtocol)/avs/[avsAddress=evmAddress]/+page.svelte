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
	import EigenLayerAvsView from '$/views/EigenLayerAvsView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EigenLayerAvs, data.selector, {
					sources: [
						Source.EigenExplorer_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.avsAddress || 'eigen layer avs')} • eigen layer avs • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'eigen layer avs'} • eigen layer avs • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EigenLayerAvs, data.selector, {
					sources: [
						Source.EigenExplorer_Rest,
					],
				}))}

		<EigenLayerAvsView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

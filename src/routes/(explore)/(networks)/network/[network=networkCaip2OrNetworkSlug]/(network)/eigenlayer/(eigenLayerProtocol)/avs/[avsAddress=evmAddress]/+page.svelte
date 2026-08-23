<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EigenLayerAvs, data.selector, {
		sources: [
			Source.EigenExplorer_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EigenLayerAvsView from '$/views/EigenLayerAvsView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.avsAddress || 'eigen layer avs')} • eigen layer avs • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'eigen layer avs'} • eigen layer avs • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EigenLayerAvsView
		selection={pageSelection}
	/>
	{/if}
</Page>

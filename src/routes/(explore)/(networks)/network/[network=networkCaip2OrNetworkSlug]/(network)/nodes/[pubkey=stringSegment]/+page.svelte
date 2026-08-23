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


	// Components
	import Page from '$/components/Page.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LightningNode, data.selector, {
				sources: [
					Source.LightningMempoolSpace_Rest,
					Source.LightningLnd_Rest,
					Source.Amboss_Graphql,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.publicKey || 'Lightning public node')} • Lightning public node • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Lightning public node'} • Lightning public node • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LightningNode, data.selector, {
				sources: [
					Source.LightningMempoolSpace_Rest,
					Source.LightningLnd_Rest,
					Source.Amboss_Graphql,
				],
			})}

	<LightningNodeView
		selection={pageSelection}
	/>
	{/if}
</Page>

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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.LightningNode, data.selector, {
		sources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
			Source.Amboss_Graphql,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.publicKey || 'Lightning public node')} • Lightning public node • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Lightning public node'} • Lightning public node • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<LightningNodeView
		selection={pageSelection}
	/>
	{/if}
</Page>

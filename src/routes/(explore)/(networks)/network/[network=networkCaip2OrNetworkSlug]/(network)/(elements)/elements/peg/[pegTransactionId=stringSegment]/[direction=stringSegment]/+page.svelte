<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ElementsPegView from '$/views/ElementsPegView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ElementsPeg, data.selector)}
		<title>{data?.title ?? ([pageSelection.entitySelector.direction, pageSelection.entitySelector.pegTransactionId].filter(Boolean).join(' ') || 'Elements peg')} • Elements peg • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Elements peg'} • Elements peg • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ElementsPeg, data.selector)}

	<ElementsPegView
		selection={pageSelection}
	/>
	{/if}
</Page>

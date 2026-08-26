<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ElementsPeg, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import ElementsPegView from '$/views/ElementsPegView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? ([pageSelection.entitySelector.direction, pageSelection.entitySelector.pegTransactionId].filter(Boolean).join(' ') || 'Elements peg')} • Elements peg • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Elements peg'} • Elements peg • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ElementsPegView
		selection={pageSelection}
	/>
	{/if}
</Page>

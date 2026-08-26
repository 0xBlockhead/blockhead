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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.MevRelay, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import MevRelayView from '$/views/MevRelayView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.host || 'MEV relay')} • MEV relay • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'MEV relay'} • MEV relay • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<MevRelayView
		selection={pageSelection}
	/>
	{/if}
</Page>

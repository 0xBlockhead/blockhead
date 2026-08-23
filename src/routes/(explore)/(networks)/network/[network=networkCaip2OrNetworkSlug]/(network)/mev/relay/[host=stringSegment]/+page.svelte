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
	import MevRelayView from '$/views/MevRelayView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.MevRelay, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.host || 'MEV relay')} • MEV relay • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'MEV relay'} • MEV relay • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.MevRelay, data.selector)}

	<MevRelayView
		selection={pageSelection}
	/>
	{/if}
</Page>

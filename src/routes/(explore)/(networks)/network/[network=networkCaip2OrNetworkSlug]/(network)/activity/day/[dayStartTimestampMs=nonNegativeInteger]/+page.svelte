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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.Network_Activity_Day, data.selector, {
		sources: [data.selector.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Network_Activity_DayView from '$/views/Network_Activity_DayView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.dayStartTimestampMs) || 'network activity day')} • network activity day • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'network activity day'} • network activity day • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<Network_Activity_DayView
		selection={pageSelection}
	/>
	{/if}
</Page>

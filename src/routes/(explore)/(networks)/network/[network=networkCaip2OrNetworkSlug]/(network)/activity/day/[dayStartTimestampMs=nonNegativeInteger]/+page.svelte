<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Network_Activity_DayView from '$/views/Network_Activity_DayView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Network_Activity_Day, data.selector, {
					sources: [data.selector.source],
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.dayStartTimestampMs) || 'network activity day')} • network activity day • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'network activity day'} • network activity day • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Network_Activity_Day, data.selector, {
					sources: [data.selector.source],
				}))}

		<Network_Activity_DayView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

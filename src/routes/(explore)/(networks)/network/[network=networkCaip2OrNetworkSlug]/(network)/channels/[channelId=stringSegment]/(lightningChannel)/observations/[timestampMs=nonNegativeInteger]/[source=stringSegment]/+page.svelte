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
	import LightningChannel_TimestampView from '$/views/LightningChannel_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.LightningChannel_Timestamp, data.selector, {
					sources: [data.selector.source],
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'Lightning public channel observation')} • Lightning public channel observation • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Lightning public channel observation'} • Lightning public channel observation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.LightningChannel_Timestamp, data.selector, {
					sources: [data.selector.source],
				}))}

		<LightningChannel_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.LightningChannel_Timestamp, data.selector, {
		sources: [data.selector.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LightningChannel_TimestampView from '$/views/LightningChannel_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'Lightning public channel observation')} • Lightning public channel observation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Lightning public channel observation'} • Lightning public channel observation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<LightningChannel_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>

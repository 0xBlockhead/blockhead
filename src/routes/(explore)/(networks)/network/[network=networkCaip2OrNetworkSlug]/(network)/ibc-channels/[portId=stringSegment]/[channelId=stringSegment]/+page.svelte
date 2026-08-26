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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.IbcChannel, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import IbcChannelView from '$/views/IbcChannelView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.channelId || 'IBC channel')} • IBC channel • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'IBC channel'} • IBC channel • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<IbcChannelView
		selection={pageSelection}
	/>
	{/if}
</Page>

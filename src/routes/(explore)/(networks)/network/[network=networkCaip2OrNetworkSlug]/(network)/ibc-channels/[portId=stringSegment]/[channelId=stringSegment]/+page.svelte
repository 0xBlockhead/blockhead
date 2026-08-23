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
	import IbcChannelView from '$/views/IbcChannelView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IbcChannel, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.channelId || 'IBC channel')} • IBC channel • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'IBC channel'} • IBC channel • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IbcChannel, data.selector)}

	<IbcChannelView
		selection={pageSelection}
	/>
	{/if}
</Page>

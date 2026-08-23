<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.FarcasterChannel, data.selector, {
		sources: [
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.id || 'Farcaster channel')} • Farcaster channel • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Farcaster channel'} • Farcaster channel • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<FarcasterChannelView
		selection={pageSelection}
	/>
	{/if}
</Page>

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


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FarcasterChannel, data.selector, {
				sources: [
					Source.Farcaster_Rest,
					Source.Neynar_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.id || 'Farcaster channel')} • Farcaster channel • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Farcaster channel'} • Farcaster channel • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FarcasterChannel, data.selector, {
				sources: [
					Source.Farcaster_Rest,
					Source.Neynar_Rest,
				],
			})}

	<FarcasterChannelView
		selection={pageSelection}
	/>
	{/if}
</Page>

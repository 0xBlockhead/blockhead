<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FarcasterCast, data.selector, {
					sources: [
						Source.Snapchain_Rest,
						Source.Neynar_Rest,
						Source.Farcaster_Rest,
					],
					fields: {
						text: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.hash ?? '') || 'Farcaster cast' : [(pageSelection.entity.text ?? ''), pageSelection.entitySelector.hash].filter(Boolean).join(' ') || 'Farcaster cast')} • Farcaster cast • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Farcaster cast'} • Farcaster cast • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FarcasterCast, data.selector, {
					sources: [
						Source.Snapchain_Rest,
						Source.Neynar_Rest,
						Source.Farcaster_Rest,
					],
					fields: {
						text: true,
					},
				}))}

		<FarcasterCastView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

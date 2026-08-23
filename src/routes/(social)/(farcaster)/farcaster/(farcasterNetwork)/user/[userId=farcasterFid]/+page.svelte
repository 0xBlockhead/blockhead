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
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FarcasterUser, data.selector, {
					sources: [
						Source.Neynar_Rest,
						Source.Snapchain_Rest,
					],
					fields: {
						displayName: true,
						username: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.fid ?? '') || 'Farcaster user' : [(pageSelection.entity.displayName ?? ''), (pageSelection.entity.username ?? ''), String(pageSelection.entitySelector.fid)].filter(Boolean).join(' ') || 'Farcaster user')} • Farcaster user • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Farcaster user'} • Farcaster user • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FarcasterUser, data.selector, {
					sources: [
						Source.Neynar_Rest,
						Source.Snapchain_Rest,
					],
					fields: {
						displayName: true,
						username: true,
					},
				}))}

		<FarcasterUserView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.FarcasterUser, data.selector, {
		sources: [
			Source.Neynar_Rest,
			Source.Snapchain_Rest,
		],
		fields: {
			displayName: true,
			username: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.fid ?? '') || 'Farcaster user' : [(pageSelection.entity.displayName ?? ''), (pageSelection.entity.username ?? ''), String(pageSelection.entitySelector.fid)].filter(Boolean).join(' ') || 'Farcaster user')} • Farcaster user • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Farcaster user'} • Farcaster user • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<FarcasterUserView
		selection={pageSelection}
	/>
	{/if}
</Page>

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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubInstancePeerView from '$/views/ActivityPubInstancePeerView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ActivityPubInstancePeer, {
					$observation: data.selector,
					peerDomain: params.peerDomain,
				}, {
					sources: [
						Source.Mastodon_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.peerDomain || 'ActivityPub instance peer')} • ActivityPub instance peer • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'ActivityPub instance peer'} • ActivityPub instance peer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ActivityPubInstancePeer, {
					$observation: data.selector,
					peerDomain: params.peerDomain,
				}, {
					sources: [
						Source.Mastodon_Rest,
					],
				}))}

		<ActivityPubInstancePeerView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>

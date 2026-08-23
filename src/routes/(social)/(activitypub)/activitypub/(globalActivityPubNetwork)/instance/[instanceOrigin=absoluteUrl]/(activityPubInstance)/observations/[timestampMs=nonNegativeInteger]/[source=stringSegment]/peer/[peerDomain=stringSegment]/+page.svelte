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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ActivityPubInstancePeer, {
		$observation: data.selector,
		peerDomain: params.peerDomain,
	}, {
		sources: [
			Source.Mastodon_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubInstancePeerView from '$/views/ActivityPubInstancePeerView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.peerDomain || 'ActivityPub instance peer')} • ActivityPub instance peer • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ActivityPub instance peer'} • ActivityPub instance peer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ActivityPubInstancePeerView
		selection={pageSelection}
	/>
	{/if}
</Page>

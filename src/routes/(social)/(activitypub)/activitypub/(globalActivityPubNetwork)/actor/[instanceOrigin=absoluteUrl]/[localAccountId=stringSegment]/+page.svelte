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
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ActivityPubActor, data.selector, {
				sources: [
					Source.Mastodon_Rest,
				],
				fields: {
					displayName: true,
					acct: true,
					username: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.localAccountId ?? '') || 'ActivityPub actor' : [(pageSelection.entity.displayName ?? ''), pageSelection.entity.acct, (pageSelection.entity.username ?? ''), pageSelection.entitySelector.localAccountId].filter(Boolean).join(' ') || 'ActivityPub actor')} • ActivityPub actor • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ActivityPub actor'} • ActivityPub actor • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ActivityPubActor, data.selector, {
				sources: [
					Source.Mastodon_Rest,
				],
				fields: {
					displayName: true,
					acct: true,
					username: true,
				},
			})}

	<ActivityPubActorView
		selection={pageSelection}
	/>
	{/if}
</Page>

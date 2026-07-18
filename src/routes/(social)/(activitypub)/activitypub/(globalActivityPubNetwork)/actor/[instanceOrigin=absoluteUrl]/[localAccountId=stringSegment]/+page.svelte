<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.ActivityPubActor, data.selector, {
		sources: [
			Source.Mastodon_Rest,
		],
		fields: {
			$icon: true,
			displayName: true,
			username: true,
			profileUrl: true,
			createdAt: true,
			note: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.displayName) ?? ''), String((pageSelection.entitySelector.acct) ?? ''), String((pageSelection.entitySelector.username) ?? ''), String((pageSelection.entitySelector.localAccountId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub actor' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).displayName) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).acct) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).username) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).localAccountId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub actor')))


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • ActivityPub actor • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubActorView
		href={
			resolve('/activitypub/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]', {
				instanceOrigin: params.instanceOrigin,
				localAccountId: params.localAccountId,
			})
		}
		selection={pageSelection}
	/>
</Page>

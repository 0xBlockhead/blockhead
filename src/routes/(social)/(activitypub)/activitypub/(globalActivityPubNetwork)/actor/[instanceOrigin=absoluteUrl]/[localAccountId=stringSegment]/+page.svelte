<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { htmlToPlainText } from '$/lib/html.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.ActivityPubActor, data.selector, {
		sources: [
			Source.Mastodon_Rest,
		],
		fields: {
			$icon: true,
			displayName: true,
			acct: true,
			username: true,
			profileUrl: true,
			activityStreamsUri: true,
			createdAt: true,
			note: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.localAccountId ?? '') || 'ActivityPub actor' : [(pageSelection.entity.displayName ?? ''), pageSelection.entity.acct, (pageSelection.entity.username ?? ''), pageSelection.entitySelector.localAccountId].filter(Boolean).join(' ') || 'ActivityPub actor')} • ActivityPub actor • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubActorView
		selection={pageSelection}
	/>
</Page>

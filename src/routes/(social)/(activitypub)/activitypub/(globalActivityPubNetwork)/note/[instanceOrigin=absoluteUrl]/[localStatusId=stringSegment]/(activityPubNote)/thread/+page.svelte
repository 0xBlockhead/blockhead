<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
</script>


<svelte:head>
	<title>ActivityPub note thread • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.ActivityPubNote, {
		instanceOrigin: decodeURIComponent(params.instanceOrigin),
		localStatusId: params.localStatusId,
	})
		.$$thread({
			sources: [
				Source.Mastodon_Rest,
			],
		})}

	<ActivityPubNotesView
		href={
			resolve(
				'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/(activityPubNote)/thread',
				{
					instanceOrigin: params.instanceOrigin,
					localStatusId: params.localStatusId,
				}
			)
		}
		title='ActivityPub note thread'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='thread'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>

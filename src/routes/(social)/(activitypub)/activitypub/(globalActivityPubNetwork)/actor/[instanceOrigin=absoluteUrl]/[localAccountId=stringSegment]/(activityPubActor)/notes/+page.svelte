<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
</script>


<svelte:head>
	<title>ActivityPub actor notes • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.ActivityPubActor, {
		instanceOrigin: decodeURIComponent(params.instanceOrigin),
		localAccountId: params.localAccountId,
	})
		.$$notes({
			sources: [
				Source.Mastodon_Rest,
			],
		})}

	<ActivityPubNotesView
		href={
			resolve(
				'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/(activityPubActor)/notes',
				{
					instanceOrigin: params.instanceOrigin,
					localAccountId: params.localAccountId,
				}
			)
		}
		title='ActivityPub actor notes'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='notes'
	/>
</Page>

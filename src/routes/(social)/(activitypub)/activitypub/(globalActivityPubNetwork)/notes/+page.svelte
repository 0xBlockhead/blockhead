<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
</script>


<svelte:head>
	<title>ActivityPub notes • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._GlobalActivityPubNetwork, {
		scope: '_GlobalActivityPubNetwork',
	})
		.$$observedNotes({
			sources: [
				Source.Mastodon_Rest,
			],
		})}

	<ActivityPubNotesView
		href={resolve('/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/notes')}
		title='ActivityPub notes'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-notes'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>

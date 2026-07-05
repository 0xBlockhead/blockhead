<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
</script>


<svelte:head>
	<title>ActivityPub notes • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubNotesView
		href={resolve('/(social)/(activitypub)/activitypub/notes')}
		title='ActivityPub notes'
		selection={
			select(EntityType.ActivityPubNetwork, {
				scope: 'ActivityPubNetwork',
			})[EntityProxyField]<EntityType.ActivityPubNote>('$$activityPubNotes', {
				sources: [
					Source.Mastodon_Rest,
					Source.Fedi_Rest,
				],
			})
		}
		id='activity-pub-notes'
	/>
</Page>

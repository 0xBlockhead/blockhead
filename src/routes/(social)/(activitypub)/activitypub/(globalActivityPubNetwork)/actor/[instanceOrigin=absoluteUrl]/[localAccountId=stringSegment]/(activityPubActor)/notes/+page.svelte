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
	<ActivityPubNotesView
		href={
			resolve('/activitypub/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/notes', {
				instanceOrigin: params.instanceOrigin,
				localAccountId: params.localAccountId,
			})
		}
		title='ActivityPub actor notes'
		selection={
			select(EntityType.ActivityPubActor, {
				instanceOrigin: decodeURIComponent(params.instanceOrigin),
				localAccountId: decodeURIComponent(params.localAccountId),
			}).$$notes({
				sources: [
					Source.Mastodon_Rest,
				],
				count: true,
			})
		}
		id='notes'
	/>
</Page>

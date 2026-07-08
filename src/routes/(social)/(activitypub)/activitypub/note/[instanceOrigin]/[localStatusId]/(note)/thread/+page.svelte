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
	<title>ActivityPub note thread • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubNotesView
		href={
			resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]/(note)/thread', {
				instanceOrigin: params.instanceOrigin,
				localStatusId: params.localStatusId,
			})
		}
		title='ActivityPub note thread'
		selection={
			select(EntityType.ActivityPubNote, {
				instanceOrigin: decodeURIComponent(params.instanceOrigin),
				localStatusId: decodeURIComponent(params.localStatusId),
			}).$$thread({
				sources: [
					Source.Mastodon_Rest,
				],
			})
		}
		id='thread'
	/>
</Page>

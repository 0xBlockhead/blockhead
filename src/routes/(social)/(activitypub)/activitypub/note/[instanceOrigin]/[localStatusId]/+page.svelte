<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


<svelte:head>
	<title>ActivityPub note • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubNoteView
		href={
			resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]', {
				instanceOrigin: params.instanceOrigin,
				localStatusId: params.localStatusId,
			})
		}
		selection={
			select(EntityType.ActivityPubNote, data.selector, {
				fields: {
					content: true,
					createdAt: true,
					$author: true,
					statusUrl: true,
				},
			})
		}
	/>
</Page>

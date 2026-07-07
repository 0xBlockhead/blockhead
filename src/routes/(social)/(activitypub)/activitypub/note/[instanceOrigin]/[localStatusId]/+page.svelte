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
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


<Page>
	<ActivityPubNoteView
		href={
			resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]', {
				instanceOrigin: params.instanceOrigin,
				localStatusId: params.localStatusId,
			})
		}
		selection={
			select(EntityType.ActivityPubNote, {
				instanceOrigin: decodeURIComponent(params.instanceOrigin),
				localStatusId: decodeURIComponent(params.localStatusId),
			}, {
				sources: [
					Source.Mastodon_Rest,
				],
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

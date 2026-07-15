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

	const pageSelection = $derived(select(EntityType.ActivityPubNote_Timestamp, {
		$note: {
			instanceOrigin: decodeURIComponent(params.instanceOrigin),
			localStatusId: decodeURIComponent(params.localStatusId),
		},
		timestampMs: Number(params.timestampMs),
	}, {
		sources: [
			Source.Mastodon_Rest,
		],
		fields: {
			favouriteCount: true,
			reblogCount: true,
			replyCount: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? 'ActivityPub note observation' : 'ActivityPub note observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubNote_TimestampView from '$/views/ActivityPubNote_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • ActivityPub note observation • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubNote_TimestampView
		href={
			resolve('/activitypub/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/observations/[timestampMs=nonNegativeInteger]', {
				instanceOrigin: params.instanceOrigin,
				localStatusId: params.localStatusId,
				timestampMs: params.timestampMs,
			})
		}
		selection={pageSelection}
	/>
</Page>

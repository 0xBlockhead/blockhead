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

	const pageSelection = $derived(select(EntityType.ActivityPubActor_Timestamp, {
		$actor: {
			instanceOrigin: decodeURIComponent(params.instanceOrigin),
			localAccountId: decodeURIComponent(params.localAccountId),
		},
		timestampMs: Number(params.timestampMs),
	}, {
		sources: [
			Source.Mastodon_Rest,
		],
		fields: {
			followersCount: true,
			followingCount: true,
			statusesCount: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? 'ActivityPub actor observation' : 'ActivityPub actor observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubActor_TimestampView from '$/views/ActivityPubActor_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • ActivityPub actor observation • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubActor_TimestampView
		href={
			resolve('/activitypub/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/observations/[timestampMs=nonNegativeInteger]', {
				instanceOrigin: params.instanceOrigin,
				localAccountId: params.localAccountId,
				timestampMs: params.timestampMs,
			})
		}
		selection={pageSelection}
	/>
</Page>

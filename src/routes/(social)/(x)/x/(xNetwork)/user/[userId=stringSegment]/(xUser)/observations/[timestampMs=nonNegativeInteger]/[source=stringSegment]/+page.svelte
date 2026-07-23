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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.XUser_Timestamp, {
		$user: {
			id: params.userId,
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$user: {
				id: params.userId,
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			followerCount: true,
			followingCount: true,
			tweetCount: true,
			listedCount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XUser_TimestampView from '$/views/XUser_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'X user observation' : 'X user observation')} • X user observation • Blockhead</title>
</svelte:head>


<Page>
	<XUser_TimestampView
		href={
			resolve('/x/user/[userId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				userId: params.userId,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>

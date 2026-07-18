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

	const pageSelection = $derived(select(EntityType.XUser_Timestamp, {
		$user: {
			id: params.userId,
		},
		timestampMs: Number(params.timestampMs),
	}, {
		sources: [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
		fields: {
			followerCount: true,
			followingCount: true,
			tweetCount: true,
			listedCount: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? 'X user observation' : 'X user observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import XUser_TimestampView from '$/views/XUser_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • X user observation • Blockhead</title>
</svelte:head>


<Page>
	<XUser_TimestampView
		href={
			resolve('/x/user/[userId=stringSegment]/observations/[timestampMs=nonNegativeInteger]', {
				userId: params.userId,
				timestampMs: params.timestampMs,
			})
		}
		selection={pageSelection}
	/>
</Page>

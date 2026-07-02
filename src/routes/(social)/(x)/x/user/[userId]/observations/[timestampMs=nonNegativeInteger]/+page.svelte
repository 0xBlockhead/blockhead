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
	import XUser_TimestampView from '$/views/XUser_TimestampView.svelte'
</script>


<svelte:head>
	<title>X user observation • Blockhead</title>
</svelte:head>


<Page>
	<XUser_TimestampView
		href={
			resolve('/(social)/(x)/x/user/[userId]/observations/[timestampMs=nonNegativeInteger]', {
				userId: params.userId,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.XUser_Timestamp, data.selector, {
				fields: {
					followerCount: true,
					followingCount: true,
					tweetCount: true,
					listedCount: true,
				},
			})
		}
	/>
</Page>

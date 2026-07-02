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
	import FarcasterUser_TimestampView from '$/views/FarcasterUser_TimestampView.svelte'
</script>


<svelte:head>
	<title>Farcaster user observation • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterUser_TimestampView
		href={
			resolve('/(social)/(farcaster)/farcaster/user/[userId=farcasterFid]/(user)/observations/[timestampMs=nonNegativeInteger]', {
				userId: params.userId,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.FarcasterUser_Timestamp, data.selector, {
				fields: {
					followerCount: true,
					followingCount: true,
				},
			})
		}
	/>
</Page>

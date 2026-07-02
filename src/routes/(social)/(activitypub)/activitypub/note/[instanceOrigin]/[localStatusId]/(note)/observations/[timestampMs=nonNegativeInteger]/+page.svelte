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
	import ActivityPubNote_TimestampView from '$/views/ActivityPubNote_TimestampView.svelte'
</script>


<svelte:head>
	<title>ActivityPub note observation • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubNote_TimestampView
		href={
			resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]/(note)/observations/[timestampMs=nonNegativeInteger]', {
				instanceOrigin: params.instanceOrigin,
				localStatusId: params.localStatusId,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.ActivityPubNote_Timestamp, data.selector, {
				fields: {
					favouriteCount: true,
					reblogCount: true,
					replyCount: true,
				},
			})
		}
	/>
</Page>

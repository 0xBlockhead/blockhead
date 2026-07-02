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
	import ActivityPubActor_TimestampView from '$/views/ActivityPubActor_TimestampView.svelte'
</script>


<svelte:head>
	<title>ActivityPub actor observation • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubActor_TimestampView
		href={
			resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]/(actor)/observations/[timestampMs=nonNegativeInteger]', {
				instanceOrigin: params.instanceOrigin,
				localAccountId: params.localAccountId,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.ActivityPubActor_Timestamp, data.selector, {
				fields: {
					followersCount: true,
					followingCount: true,
					statusesCount: true,
				},
			})
		}
	/>
</Page>

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
	import ActivityPubActor_TimestampView from '$/views/ActivityPubActor_TimestampView.svelte'
</script>


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
			select(EntityType.ActivityPubActor_Timestamp, {
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
			})
		}
	/>
</Page>

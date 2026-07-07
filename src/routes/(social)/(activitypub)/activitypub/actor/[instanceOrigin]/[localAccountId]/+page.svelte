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
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


<Page>
	<ActivityPubActorView
		href={
			resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
				instanceOrigin: params.instanceOrigin,
				localAccountId: params.localAccountId,
			})
		}
		selection={
			select(EntityType.ActivityPubActor, {
				instanceOrigin: decodeURIComponent(params.instanceOrigin),
				localAccountId: decodeURIComponent(params.localAccountId),
			}, {
				sources: [
					Source.Mastodon_Rest,
				],
				fields: {
					$icon: true,
					displayName: true,
					username: true,
					profileUrl: true,
					createdAt: true,
				},
			})
		}
	/>
</Page>

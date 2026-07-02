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
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


<svelte:head>
	<title>ActivityPub actor • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubActorView
		href={
			resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
				instanceOrigin: params.instanceOrigin,
				localAccountId: params.localAccountId,
			})
		}
		selection={
			select(EntityType.ActivityPubActor, data.selector, {
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

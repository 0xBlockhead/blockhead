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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubNetworkView from '$/views/ActivityPubNetworkView.svelte'
</script>


<svelte:head>
	<title>ActivityPub • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubNetworkView
		href={resolve('/(social)/(activitypub)/activitypub')}
		selection={
			select(EntityType.ActivityPubNetwork, data.selector, {
				fields: {
					protocolName: true,
					homeUrl: true,
					docsUrl: true,
				},
			})
		}
	/>
</Page>

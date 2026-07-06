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
	import GlobalAtprotoNetworkView from '$/views/_GlobalAtprotoNetworkView.svelte'
</script>


<svelte:head>
	<title>AT Protocol • Blockhead</title>
</svelte:head>


<Page>
	<GlobalAtprotoNetworkView
		href={resolve('/(social)/(atproto)/atproto')}
		selection={
			select(EntityType._GlobalAtprotoNetwork, data.selector, {
				fields: {
					protocolName: true,
					relationshipModel: true,
					homeUrl: true,
					docsUrl: true,
				},
			})
		}
	/>
</Page>

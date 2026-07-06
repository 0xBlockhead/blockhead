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
	import RssNetworkView from '$/views/RssNetworkView.svelte'
</script>


<svelte:head>
	<title>RSS / Atom • Blockhead</title>
</svelte:head>


<Page>
	<RssNetworkView
		href={resolve('/(social)/(rss)/rss')}
		selection={
			select(EntityType.RssNetwork, data.selector, {
				fields: {
					protocolName: true,
					homeUrl: true,
					docsUrl: true,
					registryName: true,
					relationshipModel: true,
				},
			})
		}
	/>
</Page>

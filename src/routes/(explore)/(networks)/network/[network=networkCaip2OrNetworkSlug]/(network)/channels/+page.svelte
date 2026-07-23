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
	import LightningChannelsView from '$/views/LightningChannelsView.svelte'
</script>


<svelte:head>
	<title>Channels • Blockhead</title>
</svelte:head>


<Page>
	<LightningChannelsView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/channels', {
				network: params.network,
			})
		}
		title='Channels'
		selection={select(EntityType.LightningNetwork, data.selector).$$channels}
		countResource={select(EntityType.LightningNetwork, data.selector).$$channels.count}
		id='channels'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>

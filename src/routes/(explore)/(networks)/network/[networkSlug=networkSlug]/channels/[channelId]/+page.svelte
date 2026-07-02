<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import LightningChannelView from '$/views/LightningChannelView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Channel • Blockhead</title>
</svelte:head>


<Page>
	<LightningChannelView
		selection={select(EntityType.LightningChannel, {
			$network: { slug: params.networkSlug },
			channelId: params.channelId,
		})}
		open={true}
	/>
</Page>

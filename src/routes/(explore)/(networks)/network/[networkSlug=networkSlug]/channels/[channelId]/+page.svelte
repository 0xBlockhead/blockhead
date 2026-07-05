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
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<svelte:head>
	<title>Lightning channel • Blockhead</title>
</svelte:head>


<Page>
	<LightningChannelView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/channels/[channelId]', {
				networkSlug: params.networkSlug,
				channelId: params.channelId,
			})
		}
		selection={
			select(EntityType.LightningChannel, data.selector, {
				fields: {
					shortChannelId: true,
					$node1: true,
					fundingTransactionId: true,
					fundingOutputIndex: true,
					openedAtMs: true,
				},
			})
		}
	/>
</Page>

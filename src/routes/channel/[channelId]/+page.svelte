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
	import BlockheadStateChannelView from '$/views/BlockheadStateChannelView.svelte'
</script>


<svelte:head>
	<title>blockhead state channel • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadStateChannelView
		href={
			resolve('/channel/[channelId]', {
				channelId: params.channelId,
			})
		}
		selection={
			select(EntityType.BlockheadStateChannel, data.selector, {
				fields: {
					createdAt: true,
					$network: true,
					$participant0: true,
					$participant1: true,
					$asset: true,
					$room: true,
				},
			})
		}
	/>
</Page>

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

	const pageSelection = $derived(select(EntityType.BlockheadStateChannel, {
		id: params.channelId,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			createdAt: true,
			$network: true,
			$participant0: true,
			$participant1: true,
			$asset: true,
			$room: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadStateChannelView from '$/views/BlockheadStateChannelView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? [String(({
		id: params.channelId,
	}.id) ?? '')].filter(Boolean).join(' ') || 'blockhead state channel' : [String((({ ...{
		id: params.channelId,
	}, ...pageSelection.entity }).id) ?? '')].filter(Boolean).join(' ') || 'blockhead state channel')} • blockhead state channel • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadStateChannelView
		href={
			resolve('/channel/[channelId=stringSegment]', {
				channelId: params.channelId,
			})
		}
		selection={pageSelection}
	/>
</Page>

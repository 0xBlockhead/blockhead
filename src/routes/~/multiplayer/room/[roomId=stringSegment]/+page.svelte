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

	const pageSelection = $derived(select(EntityType.BlockheadRoom, {
		id: params.roomId,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			name: true,
			createdAt: true,
			createdBy: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.name) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'room' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).id) ?? '')].filter(Boolean).join(' ') || 'room'))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • room • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadRoomView
		href={
			resolve('/~/multiplayer/room/[roomId=stringSegment]', {
				roomId: params.roomId,
			})
		}
		selection={pageSelection}
	/>
</Page>

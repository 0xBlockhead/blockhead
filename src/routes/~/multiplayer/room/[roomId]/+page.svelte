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
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
</script>


<svelte:head>
	<title>room • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadRoomView
		href={
			resolve('/~/multiplayer/room/[roomId]', {
				roomId: params.roomId,
			})
		}
		selection={
			select(EntityType.BlockheadRoom, data.selector, {
				fields: {
					name: true,
					createdAt: true,
					createdBy: true,
				},
			})
		}
	/>
</Page>

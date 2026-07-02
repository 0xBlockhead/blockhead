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
	import BlockheadRoomPeerView from '$/views/BlockheadRoomPeerView.svelte'
</script>


<svelte:head>
	<title>contact • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadRoomPeerView
		href={
			resolve('/~/multiplayer/contact/[contactId]', {
				contactId: params.contactId,
			})
		}
		selection={
			select(EntityType.BlockheadRoomPeer, data.selector, {
				fields: {
					displayName: true,
					isConnected: true,
					peerId: true,
					$room: true,
					joinedAt: true,
					lastSeenAt: true,
					connectedAt: true,
					disconnectedAt: true,
				},
			})
		}
	/>
</Page>

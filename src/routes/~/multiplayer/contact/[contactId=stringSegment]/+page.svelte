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

	const pageSelection = $derived(select(EntityType.BlockheadRoomPeer, {
		id: params.contactId,
	}, {
		sources: [
			Source.Local_Internal,
		],
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
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.displayName) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.peerId) ?? '')].filter(Boolean).join(' ') || 'contact' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).displayName) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).peerId) ?? '')].filter(Boolean).join(' ') || 'contact'))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRoomPeerView from '$/views/BlockheadRoomPeerView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • contact • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadRoomPeerView
		href={
			resolve('/~/multiplayer/contact/[contactId=stringSegment]', {
				contactId: params.contactId,
			})
		}
		selection={pageSelection}
	/>
</Page>

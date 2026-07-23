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


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRoomPeerView from '$/views/BlockheadRoomPeerView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'contact' : [String((({ ...{
		id: params.contactId,
	}, ...pageSelection.entity }).displayName) ?? '')].filter(Boolean).join(' ') || [String((({ ...{
		id: params.contactId,
	}, ...pageSelection.entity }).peerId) ?? '')].filter(Boolean).join(' ') || 'contact')} • contact • Blockhead</title>
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

<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRoomPeerView from '$/views/BlockheadRoomPeerView.svelte'
</script>


<Page>
	<BlockheadRoomPeerView
		selection={select(EntityType.BlockheadRoomPeer, { id: params.contactId })}
	/>
</Page>

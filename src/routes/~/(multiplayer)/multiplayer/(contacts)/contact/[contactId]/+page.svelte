<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// Props
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRoomPeerView from '$/views/BlockheadRoomPeerView.svelte'
</script>


<Page>
	<BlockheadRoomPeerView
		entityId={{ id: params.contactId }}
		href={resolve('/~/multiplayer/contacts')}
	/>
</Page>

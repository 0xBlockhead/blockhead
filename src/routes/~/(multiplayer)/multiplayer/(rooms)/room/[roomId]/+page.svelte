<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// Props
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
</script>


<Page>
	<BlockheadRoomView
		entityId={{ id: params.roomId }}
		href={resolve('/~/multiplayer/rooms')}
	/>
</Page>

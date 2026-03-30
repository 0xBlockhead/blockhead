<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRoomsView from '$/views/BlockheadRoomsView.svelte'
</script>


<Page>
	<BlockheadRoomsView
		href={resolve('/~/multiplayer/rooms')}
		id="rooms"
	/>
</Page>

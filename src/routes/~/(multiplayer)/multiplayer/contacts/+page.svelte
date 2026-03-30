<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRoomPeersView from '$/views/BlockheadRoomPeersView.svelte'
</script>


<Page>
	<BlockheadRoomPeersView
		href={resolve('/~/multiplayer/contacts')}
		id="contacts"
	/>
</Page>

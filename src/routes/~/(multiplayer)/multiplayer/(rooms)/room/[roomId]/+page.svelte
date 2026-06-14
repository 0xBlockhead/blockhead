<script lang="ts">
	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
</script>


<Page>
	<BlockheadRoomView
		selector={{ id: params.roomId }}
	/>
</Page>

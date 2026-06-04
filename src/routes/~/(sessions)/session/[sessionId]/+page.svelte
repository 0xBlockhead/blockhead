<script lang="ts">
	// Props
	let {
		params,
	} = $props()


	// Components
	import BlockheadSessionView from '$/views/BlockheadSessionView.svelte'
	import Page from '$/components/Page.svelte'
</script>


<Page>
	<BlockheadSessionView
		entityId={{ id: params.sessionId }}
	/>
</Page>

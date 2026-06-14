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
		selector={{ id: params.sessionId }}
	/>
</Page>

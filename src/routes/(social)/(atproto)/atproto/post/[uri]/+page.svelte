<script lang="ts">
	// State
	let {
		params,
	} = $props()


	const entityId = $derived(
		{ uri: decodeURIComponent(params.uri) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
</script>


<Page>
	<AtprotoPostView
		{entityId}
	>
	</AtprotoPostView>
</Page>

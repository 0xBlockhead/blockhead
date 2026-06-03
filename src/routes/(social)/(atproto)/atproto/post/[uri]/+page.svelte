<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
</script>


<Page>
	<AtprotoPostView
		entityId={{ uri: decodeURIComponent(params.uri) }}
	>
	</AtprotoPostView>
</Page>

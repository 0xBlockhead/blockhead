<script lang="ts">
	// State
	let {
		params,
	} = $props()

	const entityId = $derived(
		{ id: decodeURIComponent(params.postId) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<Page>
	<LensPostView
		{entityId}
	>
	</LensPostView>
</Page>

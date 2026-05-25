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
	import XPostView from '$/views/XPostView.svelte'
</script>


<Page>
	<XPostView
		{entityId}
	>
	</XPostView>
</Page>

<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import XPostView from '$/views/XPostView.svelte'
</script>


<Page>
	<XPostView
		entityId={{ id: decodeURIComponent(params.postId) }}
	>
	</XPostView>
</Page>

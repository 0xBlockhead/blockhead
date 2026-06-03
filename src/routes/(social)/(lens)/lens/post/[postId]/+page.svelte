<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<Page>
	<LensPostView
		entityId={{ id: decodeURIComponent(params.postId) }}
	>
	</LensPostView>
</Page>

<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


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
		href={resolve(
			'/(social)/(lens)/lens/post/[postId]',
			{ postId: encodeURIComponent(entityId.id) },
		)}
	>
	</LensPostView>
</Page>

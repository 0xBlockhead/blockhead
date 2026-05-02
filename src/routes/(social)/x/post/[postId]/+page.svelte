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
	import XPostView from '$/views/XPostView.svelte'
</script>


<Page>
	<XPostView
		{entityId}
		href={resolve(
			'/(social)/x/post/[postId]',
			{ postId: encodeURIComponent(entityId.id) },
		)}
	>
	</XPostView>
</Page>

<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


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
		href={resolve(
			'/(social)/atproto/post/[uri]',
			{ uri: encodeURIComponent(entityId.uri) },
		)}
	>
	</AtprotoPostView>
</Page>

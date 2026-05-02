<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	const entityId = $derived(
		{ fullname: decodeURIComponent(params.fullname) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


<Page>
	<RedditLinkView
		{entityId}
		href={resolve(
			'/(social)/reddit/link/[fullname]',
			{ fullname: encodeURIComponent(entityId.fullname) },
		)}
	>
	</RedditLinkView>
</Page>

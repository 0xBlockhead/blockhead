<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	const entityId = $derived(
		{ name: decodeURIComponent(params.name).toLowerCase() },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<Page>
	<RedditSubredditView
		{entityId}
		href={resolve(
			'/(social)/(reddit)/reddit/r/[name]',
			{ name: encodeURIComponent(entityId.name) },
		)}
	>
	</RedditSubredditView>
</Page>

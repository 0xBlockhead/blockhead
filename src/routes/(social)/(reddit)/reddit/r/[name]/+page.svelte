<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<Page>
	<RedditSubredditView
		entityId={{ name: decodeURIComponent(params.name).toLowerCase() }}
	>
	</RedditSubredditView>
</Page>

<script lang="ts">
	// Props
	let {
		params,
	} = $props()


	const entityId = $derived(
		{ fullname: decodeURIComponent(params.fullname) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>


<Page>
	<RedditCommentView
		{entityId}
	>
	</RedditCommentView>
</Page>

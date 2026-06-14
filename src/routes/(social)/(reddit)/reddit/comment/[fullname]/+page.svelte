<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>


<Page>
	<RedditCommentView
		selector={{ fullname: decodeURIComponent(params.fullname) }}
	>
	</RedditCommentView>
</Page>

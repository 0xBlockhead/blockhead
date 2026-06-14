<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


<Page>
	<RedditLinkView
		selector={{ fullname: decodeURIComponent(params.fullname) }}
	>
	</RedditLinkView>
</Page>

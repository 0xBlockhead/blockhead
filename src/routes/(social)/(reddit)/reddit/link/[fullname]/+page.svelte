<script lang="ts">
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
	>
	</RedditLinkView>
</Page>

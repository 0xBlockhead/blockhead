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
		entityId={{ fullname: decodeURIComponent(params.fullname) }}
	>
	</RedditLinkView>
</Page>

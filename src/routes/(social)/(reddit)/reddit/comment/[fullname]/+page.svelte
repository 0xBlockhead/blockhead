<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


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
		href={resolve(
			'/(social)/(reddit)/reddit/comment/[fullname]',
			{ fullname: encodeURIComponent(entityId.fullname) },
		)}
	>
	</RedditCommentView>
</Page>

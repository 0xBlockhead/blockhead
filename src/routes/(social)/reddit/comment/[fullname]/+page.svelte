<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(EntityType.RedditComment, { fullname: decodeURIComponent(params.fullname) })}
	>
	</RedditCommentView>
</Page>

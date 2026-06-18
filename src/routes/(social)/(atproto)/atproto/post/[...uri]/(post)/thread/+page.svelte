<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()


	// Components
	import AtprotoPostThreadView from '$/views/AtprotoPostThreadView.svelte'
	import Page from '$/components/Page.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
</script>


<Page>
	<AtprotoPostThreadView
		selection={select(
			EntityType.AtprotoPost,
			{
				uri: decodeURIComponent(params.uri),
			}
		).$$thread}
		id="atproto-post-thread"
		title="Thread"
	/>
</Page>

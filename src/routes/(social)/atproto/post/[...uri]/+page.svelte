<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
</script>


<Page>
	<AtprotoPostView
		selection={select(EntityType.AtprotoPost, { uri: decodeURIComponent(params.uri) })}
	>
	</AtprotoPostView>
</Page>

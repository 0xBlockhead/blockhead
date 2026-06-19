<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		data,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RssItemView from '$/views/RssItemView.svelte'
</script>


<Page>
	<RssItemView
		selection={select(EntityType.RssItem, data.selector)}
	/>
</Page>

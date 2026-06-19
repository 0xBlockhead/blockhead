<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'

	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import RssView from '$/views/RssView.svelte'
</script>


<Page>
	<RssView
		selection={select(EntityType.RssNetwork, { scope: 'RssNetwork' })}
	/>
</Page>

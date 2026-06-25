<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import PythPriceFeedView from '$/views/PythPriceFeedView.svelte'
</script>


<Page>
	<PythPriceFeedView
		selection={select(EntityType.PythPriceFeed, data.selector)}
	/>
</Page>

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
	import CosmosBlockView from '$/views/CosmosBlockView.svelte'
</script>


<Page>
	<CosmosBlockView
		selection={select(EntityType.CosmosBlock, data.selector)}
	/>
</Page>

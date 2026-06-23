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
	import ElementsNetworkView from '$/views/ElementsNetworkView.svelte'
</script>


<Page>
	<ElementsNetworkView
		selection={select(EntityType.ElementsNetwork, data.selector)}
	/>
</Page>

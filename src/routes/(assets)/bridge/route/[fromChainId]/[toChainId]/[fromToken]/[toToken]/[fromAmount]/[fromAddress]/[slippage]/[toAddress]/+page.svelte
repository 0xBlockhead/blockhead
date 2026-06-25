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
	import BridgeRouteView from '$/views/BridgeRouteView.svelte'
</script>


<Page>
	<BridgeRouteView
		selection={select(EntityType.BridgeRoute, data.selector)}
	/>
</Page>

<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { PageProps } from './$types.ts'


	// State
	let {
		data,
	}: PageProps = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import BridgeRouteStepView from '$/views/BridgeRouteStepView.svelte'
</script>


<Page>
	<BridgeRouteStepView selection={select(EntityType.BridgeRouteStep, data.selector)} />
</Page>

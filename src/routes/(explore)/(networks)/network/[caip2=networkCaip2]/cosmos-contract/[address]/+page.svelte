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
	import CosmosContractView from '$/views/CosmosContractView.svelte'
</script>


<Page>
	<CosmosContractView
		selection={select(EntityType.CosmosContract, data.selector)}
	/>
</Page>

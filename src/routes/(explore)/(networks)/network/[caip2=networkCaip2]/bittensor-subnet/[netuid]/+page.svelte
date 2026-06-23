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
	import BittensorSubnetView from '$/views/BittensorSubnetView.svelte'
</script>


<Page>
	<BittensorSubnetView
		selection={select(EntityType.BittensorSubnet, data.selector)}
	/>
</Page>

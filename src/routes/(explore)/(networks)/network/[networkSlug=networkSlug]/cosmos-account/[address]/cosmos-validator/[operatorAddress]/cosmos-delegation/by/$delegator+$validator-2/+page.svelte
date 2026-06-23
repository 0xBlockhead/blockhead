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
	import CosmosDelegationView from '$/views/CosmosDelegationView.svelte'
</script>


<Page>
	<CosmosDelegationView
		selection={select(EntityType.CosmosDelegation, data.selector)}
	/>
</Page>

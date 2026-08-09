<!-- Generated from APP.ts. -->

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
	import SorobanContractView from '$/views/SorobanContractView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'soroban contract'} • soroban contract • Blockhead</title>
</svelte:head>


<Page>
	<SorobanContractView
		selection={select(EntityType.SorobanContract, data.selector)}
	/>
</Page>

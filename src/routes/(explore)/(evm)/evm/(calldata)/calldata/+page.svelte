<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmCalldataView from '$/views/EvmCalldataView.svelte'
</script>


<svelte:head>
	<title>EVM calldata • Blockhead</title>
</svelte:head>


<Page>
	<EvmCalldataView
		href={resolve('/(explore)/(evm)/evm/(calldata)/calldata')}
		selection={select(EntityType.EvmCalldata, data.selector)}
	/>
</Page>

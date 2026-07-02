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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmErrorView from '$/views/EvmErrorView.svelte'
</script>


<svelte:head>
	<title>EVM error • Blockhead</title>
</svelte:head>


<Page>
	<EvmErrorView
		href={
			resolve('/(explore)/(evm)/evm/(errors)/error/[hex]', {
				hex: params.hex,
			})
		}
		selection={select(EntityType.EvmError, data.selector)}
	/>
</Page>

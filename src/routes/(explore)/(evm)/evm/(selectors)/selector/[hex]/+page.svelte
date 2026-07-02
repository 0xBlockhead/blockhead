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
	import EvmSelectorView from '$/views/EvmSelectorView.svelte'
</script>


<svelte:head>
	<title>EVM selector • Blockhead</title>
</svelte:head>


<Page>
	<EvmSelectorView
		href={
			resolve('/(explore)/(evm)/evm/(selectors)/selector/[hex]', {
				hex: params.hex,
			})
		}
		selection={select(EntityType.EvmSelector, data.selector)}
	/>
</Page>

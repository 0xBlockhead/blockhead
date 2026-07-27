<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmSelector, data.selector, {
		sources: [
			Source.Openchain_Rest,
		],
		fields: {
			signatures: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmSelectorView from '$/views/EvmSelectorView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? ('EVM selector'))} • EVM selector • Blockhead</title>
</svelte:head>


<Page>
	<EvmSelectorView
		selection={pageSelection}
	/>
</Page>

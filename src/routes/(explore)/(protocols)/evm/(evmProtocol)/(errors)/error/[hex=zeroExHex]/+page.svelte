<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmErrorView from '$/views/EvmErrorView.svelte'
</script>


<svelte:head>
	<title>EVM error • EVM error • Blockhead</title>
</svelte:head>


<Page>
	<EvmErrorView
		selection={
			select(EntityType.EvmError, {
				hex: params.hex,
			}, {
				sources: [
					Source.Openchain_Rest,
					Source.FourByteDirectory_Rest,
				],
			})
		}
	/>
</Page>

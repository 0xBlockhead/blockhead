<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmContract, data.selector, {
		sources: [
			Source.Constants_Internal,
			Source.Blockscout_Rest,
		],
		fields: {
			precompileName: true,
			$deployer: true,
			$creationTransaction: true,
			$implementation: true,
			$verification: true,
			codeHash: true,
			code: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.address ?? '') || 'EVM contract' : [(pageSelection.entity.precompileName ?? ''), String(pageSelection.entitySelector.address)].filter(Boolean).join(' ') || 'EVM contract'))} • EVM contract • Blockhead</title>
</svelte:head>


<Page>
	<EvmContractView
		selection={pageSelection}
	/>
</Page>

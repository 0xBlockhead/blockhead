<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmCalldata, {
		hex: params.hex,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmCalldataView from '$/views/EvmCalldataView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? [String(({
		hex: params.hex,
	}.hex) ?? '')].filter(Boolean).join(' ') || 'EVM calldata' : [String((({ ...{
		hex: params.hex,
	}, ...pageSelection.entity }).hex) ?? '')].filter(Boolean).join(' ') || 'EVM calldata')} • EVM calldata • Blockhead</title>
</svelte:head>


<Page>
	<EvmCalldataView
		href={
			resolve('/evm/calldata/[hex=zeroExHex]', {
				hex: params.hex,
			})
		}
		selection={pageSelection}
	/>
</Page>

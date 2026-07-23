<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.Erc4337Paymaster, data.selector, {
		fields: {
			$contract: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337PaymasterView from '$/views/Erc4337PaymasterView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.address) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 paymaster' : [String((({ ...data.selector, ...pageSelection.entity }).address) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 paymaster'))} • ERC-4337 paymaster • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337PaymasterView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/paymaster/[address=evmAddress]', {
				network: params.network,
				address: params.address,
			})
		}
		selection={pageSelection}
	/>
</Page>

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

	const pageSelection = $derived(select(EntityType.Erc4337AccountFactory, data.selector, {
		fields: {
			$contract: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.address) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 account factory' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).address) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 account factory')))


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337AccountFactoryView from '$/views/Erc4337AccountFactoryView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • ERC-4337 account factory • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337AccountFactoryView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/account-factory/[address=evmAddress]', {
				network: params.network,
				address: params.address,
			})
		}
		selection={pageSelection}
	/>
</Page>

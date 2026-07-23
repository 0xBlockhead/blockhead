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

	const pageSelection = $derived(select(EntityType.Erc4337Bundler, data.selector, {
		fields: {
			$contract: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337BundlerView from '$/views/Erc4337BundlerView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.address) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 bundler' : [String((({ ...data.selector, ...pageSelection.entity }).address) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 bundler'))} • ERC-4337 bundler • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337BundlerView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/bundler/[address=evmAddress]', {
				network: params.network,
				address: params.address,
			})
		}
		selection={pageSelection}
	/>
</Page>

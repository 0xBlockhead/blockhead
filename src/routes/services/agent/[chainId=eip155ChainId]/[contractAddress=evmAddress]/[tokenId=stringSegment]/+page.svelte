<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmNftFormat, EvmNftStandard } from '$/constants/Evm.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmNft, {
		$contract: {
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: params.chainId,
				},
			},
			address: params.contractAddress,
		},
		tokenId: params.tokenId,
	}, {
		sources: [
			Source.Eip8004Scan_Rest,
		],
		fields: {
			name: true,
			standard: true,
			format: true,
			agentRegistry: true,
			agentId: true,
			agentUri: true,
			contactEndpoint: true,
			$agentWallet: true,
			x402Support: true,
			active: true,
			supportedTrust: true,
			registrationTypeIri: true,
			fetchedAt: true,
			description: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.name) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.tokenId) ?? '')].filter(Boolean).join(' ') || 'EVM NFT' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).tokenId) ?? '')].filter(Boolean).join(' ') || 'EVM NFT'))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNftView from '$/views/EvmNftView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • EVM NFT • Blockhead</title>
</svelte:head>


<Page>
	<EvmNftView
		href={
			resolve('/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId=stringSegment]', {
				chainId: params.chainId,
				contractAddress: params.contractAddress,
				tokenId: params.tokenId,
			})
		}
		selection={pageSelection}
	/>
</Page>

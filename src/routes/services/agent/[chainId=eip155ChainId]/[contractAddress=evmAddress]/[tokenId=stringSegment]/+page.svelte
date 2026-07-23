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
			Eip8004Registration: {
				fields: {
					agentRegistry: true,
					agentId: true,
					agentUri: true,
					contactEndpoint: true,
					$agentWallet: true,
					x402Support: true,
					supportedTrust: true,
					registrationTypeIri: true,
					fetchedAt: true,
				},
			},
			active: true,
			description: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNftView from '$/views/EvmNftView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? [String(({
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
	}.tokenId) ?? '')].filter(Boolean).join(' ') || 'EVM NFT' : [String((({ ...{
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
	}, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || [String((({ ...{
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
	}, ...pageSelection.entity }).tokenId) ?? '')].filter(Boolean).join(' ') || 'EVM NFT')} • EVM NFT • Blockhead</title>
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

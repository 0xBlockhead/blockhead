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
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.tokenId ?? '') || 'EVM NFT' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.tokenId || 'EVM NFT'} • EVM NFT • Blockhead</title>
</svelte:head>


<Page>
	<EvmNftView
		selection={pageSelection}
	/>
</Page>

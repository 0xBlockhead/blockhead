<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNftView from '$/views/EvmNftView.svelte'
</script>


<Page>
	<EvmNftView
		href={
			resolve('/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId]', {
				chainId: params.chainId,
				contractAddress: params.contractAddress,
				tokenId: params.tokenId,
			})
		}
		selection={
			select(EntityType.EvmNft, {
				$contract: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: params.chainId,
						},
					},
					address: params.contractAddress,
				},
				tokenId: decodeURIComponent(params.tokenId),
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
			})
		}
	/>
</Page>

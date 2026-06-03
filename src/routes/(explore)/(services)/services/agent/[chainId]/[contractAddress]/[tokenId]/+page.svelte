<script lang="ts">
	// Types/constants
	import { EvmAddress } from '$/schema/$ZeroExHex.ts'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004RegistrationView from '$/views/Eip8004RegistrationView.svelte'
</script>


<Page>
	<Eip8004RegistrationView
		entityId={{
			$contract: {
				$network: { caip2: { namespace: 'eip155' as const, reference: String(Number(params.chainId)) } },
				address: EvmAddress.assert(decodeURIComponent(params.contractAddress)),
			},
			tokenId: decodeURIComponent(params.tokenId),
		}}
	/>
</Page>

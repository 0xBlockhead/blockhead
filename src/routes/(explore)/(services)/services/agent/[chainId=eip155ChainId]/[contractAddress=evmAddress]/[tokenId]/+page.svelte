<script lang="ts">
	// Functions
	import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'


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
		selector={{
			$contract: {
				$network: { caip2: { namespace: 'eip155' as const, reference: String(Number(params.chainId)) } },
				address: with0xHex(params.contractAddress),
			},
			tokenId: decodeURIComponent(params.tokenId),
		}}
	/>
</Page>

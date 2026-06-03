<script lang="ts">
	// State
	let {
		params,
	} = $props()

	import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
	// Components
	import Page from '$/components/Page.svelte'
	import VaultView from '$/views/VaultView.svelte'
</script>


<Page>
	<VaultView
		entityId={{
			$network: { caip2: { namespace: 'eip155' as const, reference: String(Number(params.chainId)) } },
			id: hexLowerOfByteSize(decodeURIComponent(params.vaultId).trim(), 20)
				?? decodeURIComponent(params.vaultId).trim(),
		}}
	/>
</Page>

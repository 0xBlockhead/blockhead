<script lang="ts">
	// State
	let {
		params,
	} = $props()

	const pairId = $derived.by(() => (
		hexLowerOfByteSize(decodeURIComponent(params.vaultId).trim(), 20)
		?? decodeURIComponent(params.vaultId).trim()
	))


	// Components
	import Page from '$/components/Page.svelte'
	import VaultView from '$/views/VaultView.svelte'


	// State
	import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
</script>


<Page>
	<VaultView
		entityId={{
			$network: { chainId: Number(params.chainId) },
			id: pairId,
		}}
	/>
</Page>

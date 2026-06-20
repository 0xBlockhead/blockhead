<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(EntityType.Vault, {
			$network: { caip2: { namespace: 'eip155' as const, reference: String(Number(params.chainId)) } },
			id: hexLowerOfByteSize(decodeURIComponent(params.vaultId), 20)
				?? decodeURIComponent(params.vaultId),
		})}
	/>
</Page>

<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	const chainId = $derived(Number(params.chainId))


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeTransactionView from '$/views/BridgeTransactionView.svelte'
</script>


<Page>
	<BridgeTransactionView
		entityId={{
			$account: {
				$network: { chainId },
				address: params.address as `0x${string}`,
			},
			$sourceTx: {
				$network: { chainId },
				txHash: params.sourceTxHash as `0x${string}`,
			},
			createdAt: Number(params.createdAt),
		}}
		href={resolve(
			`/~/accounts/transaction/${params.chainId}/${params.address}/${params.sourceTxHash}/${params.createdAt}`,
		)}
	/>
</Page>

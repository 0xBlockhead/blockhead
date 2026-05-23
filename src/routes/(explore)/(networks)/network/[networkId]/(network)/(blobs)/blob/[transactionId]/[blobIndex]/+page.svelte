<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlobView from '$/views/EvmBlobView.svelte'
</script>


<Page>
		<EvmBlobView
		entityId={{
			$network: { chainId: Number(params.networkId) },
			txHash: params.transactionId as `0x${string}`,
			blobIndex: Number(params.blobIndex),
		}}
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(blobs)/blob/[transactionId]/[blobIndex]',
			params,
		)}
	/>
</Page>


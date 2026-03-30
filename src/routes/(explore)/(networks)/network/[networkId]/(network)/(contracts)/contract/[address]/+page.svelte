<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<Page>
	<EvmContractView
		entityId={{
			$network: { chainId: Number(params.networkId) },
			address: (
				params.address.startsWith('0x') ?
					params.address
				:
					`0x${params.address}`
			) as `0x${string}`,
		}}
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
			params,
		)}
	/>
</Page>

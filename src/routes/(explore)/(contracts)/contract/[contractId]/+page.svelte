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
		entityId={(
			((cid) => {
				const address = cid.split(':').slice(1).join(':') || cid
				return ({
					$network: { chainId: Number(cid.split(':')[0]) || 1 },
					address: (
						address.startsWith('0x') ?
							address
						:
							`0x${address}`
					) as `0x${string}`,
				})
			})(params.contractId)
		)}
		href={resolve('/(explore)/(contracts)/contract/[contractId]', params)}
	/>
</Page>

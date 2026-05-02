<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	const chainId = $derived(
		Number(params.contractId.split(':')[0]) || 1,
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Page from '$/components/Page.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<Page>
	<section>
		<NetworkView
			entityId={{ chainId }}
			href={resolve('/(explore)/(networks)/network/[networkId]', {
				networkId: String(chainId),
			})}
			layout={EntityLayout.Summary}
			open={false}
		/>
	</section>

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

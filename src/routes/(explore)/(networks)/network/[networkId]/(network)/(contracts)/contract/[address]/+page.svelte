<script lang="ts">
	import type { PageProps } from './$types.ts'

	import { resolve } from '$app/paths'

	import Page from '$/components/Page.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'

	let { data }: PageProps = $props()
</script>


<Page>
	<EvmContractView
		entityId={data.entityId}
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
			{
				networkId: String(data.entityId.$network.chainId),
				address: data.entityId.address,
			},
		)}
	/>
</Page>

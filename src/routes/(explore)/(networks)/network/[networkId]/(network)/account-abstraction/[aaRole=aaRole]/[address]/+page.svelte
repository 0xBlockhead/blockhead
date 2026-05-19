<script lang="ts">
	import type { PageProps } from './$types.ts'

	import { resolve } from '$app/paths'

	import Page from '$/components/Page.svelte'
	import EvmAccountAbstractionAddressView from '$/views/EvmAccountAbstractionAddressView.svelte'

	let { data }: PageProps = $props()
</script>


<Page>
	<EvmAccountAbstractionAddressView
		entityId={data.entityId}
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/account-abstraction/[aaRole]/[address]',
			{
				networkId: String(data.entityId.$network.chainId),
				aaRole: data.entityId.role,
				address: data.entityId.address,
			},
		)}
	/>
</Page>

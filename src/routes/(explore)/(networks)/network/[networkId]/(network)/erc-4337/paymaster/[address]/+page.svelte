<script lang="ts">
	import type { PageProps } from './$types.ts'

	import { resolve } from '$app/paths'

	import Page from '$/components/Page.svelte'
	import Erc4337PaymasterView from '$/views/Erc4337PaymasterView.svelte'

	let { data }: PageProps = $props()
</script>


<Page>
	<Erc4337PaymasterView
		entityId={data.entityId}
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/erc-4337/paymaster/[address]',
			{
				networkId: String(data.entityId.$network.chainId),
				address: data.entityId.address,
			},
		)}
	/>
</Page>

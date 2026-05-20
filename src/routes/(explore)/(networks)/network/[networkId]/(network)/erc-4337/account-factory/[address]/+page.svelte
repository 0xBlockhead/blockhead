<script lang="ts">
	import type { PageProps } from './$types.ts'

	import { resolve } from '$app/paths'

	import Page from '$/components/Page.svelte'
	import Erc4337AccountFactoryView from '$/views/Erc4337AccountFactoryView.svelte'

	let { data }: PageProps = $props()
</script>


<Page>
	<Erc4337AccountFactoryView
		entityId={data.entityId}
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/erc-4337/account-factory/[address]',
			{
				networkId: String(data.entityId.$network.chainId),
				address: data.entityId.address,
			},
		)}
	/>
</Page>

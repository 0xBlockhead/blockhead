<script lang="ts">
	import type { PageProps } from './$types.ts'

	import { resolve } from '$app/paths'

	import Page from '$/components/Page.svelte'
	import Erc4337SmartAccountView from '$/views/Erc4337SmartAccountView.svelte'

	let { data }: PageProps = $props()
</script>


<Page>
	<Erc4337SmartAccountView
		entityId={data.entityId}
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/erc-4337/smart-account/[address]',
			{
				networkId: String(data.entityId.$network.chainId),
				address: data.entityId.address,
			},
		)}
	/>
</Page>

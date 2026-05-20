<script lang="ts">
	import type { PageProps } from './$types.ts'

	import { resolve } from '$app/paths'

	import Page from '$/components/Page.svelte'
	import Erc4337BundlerView from '$/views/Erc4337BundlerView.svelte'

	let { data }: PageProps = $props()
</script>


<Page>
	<Erc4337BundlerView
		entityId={data.entityId}
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/erc-4337/bundler/[address]',
			{
				networkId: String(data.entityId.$network.chainId),
				address: data.entityId.address,
			},
		)}
	/>
</Page>

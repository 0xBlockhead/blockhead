<script lang="ts">
	import type { PageProps } from './$types.ts'

	import { resolve } from '$app/paths'

	import Page from '$/components/Page.svelte'
	import EvmUserOperationView from '$/views/EvmUserOperationView.svelte'

	let { data }: PageProps = $props()
</script>


<Page>
	<EvmUserOperationView
		entityId={data.entityId}
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/user-operation/[userOperationHash]',
			{
				networkId: String(data.entityId.$network.chainId),
				userOperationHash: data.entityId.hash,
			},
		)}
	/>
</Page>

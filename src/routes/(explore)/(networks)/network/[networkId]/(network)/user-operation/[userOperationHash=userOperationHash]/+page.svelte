<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmUserOperationView from '$/views/EvmUserOperationView.svelte'
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

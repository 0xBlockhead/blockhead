<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'

	import { EntityLayout } from '$/components/EntityView.svelte'
	import Page from '$/components/Page.svelte'
	import ResourceBoundary, { Layout } from '$/components/ResourceBoundary.svelte'
	import ContractView from '$/views/ContractView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'

	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()


	// State
	const ensName = useEntity(
		EntityType.EnsName,
		{ name: params.ensName } satisfies EntityId<typeof schema, EntityType.EnsName>,
		{
			$: [Source.Voltaire_JsonRpc],
			$resolverContract: {},
		},
	)
</script>


<Page>
	<ResourceBoundary
		layout={Layout.Block}
		resource={ensName}
	>
		{#snippet children(live)}
			{@const contractId = live.$resolverContract?.[EntityMetaKey.Id]}
			{#if contractId}
				<section>
					<NetworkView
						entityId={{
							chainId: contractId.$network.chainId,
						}}
						href={resolve('/(explore)/(networks)/network/[networkId]', {
							networkId: String(contractId.$network.chainId),
						})}
						layout={EntityLayout.Summary}
						open={false}
					/>
				</section>

				<ContractView
					entityId={contractId}
					href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolver', {
						ensName: params.ensName,
					})}
				/>
			{:else}
				<p data-text="muted">
					No resolver contract on the Voltaire ENS row for <span data-text="font-monospace">{params.ensName}</span> yet.
				</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>

<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { ensEthereumChainId } from '$/constants/Ens.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'


	// State
	let {
		entityId,
	}: {
		entityId: EntityId<typeof schema, EntityType.EnsName>
	} = $props()

	const ens = useEntity(entityCollectionsContext, EntityType.EnsName,
		entityId,
		({ sources: [Source.Voltaire_JsonRpc], fields: { $resolverContract: true } }),
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<ResourceBoundary
	placeholderText="Loading resolver…"
	resource={ens}
>
	{#snippet children(ens)}
		{@const contractId = ens.fields.$resolverContract?.[EntityMetaKey.Id]}
		{#if contractId}
			<section>
				<EvmNetworkView
					entityId={{ chainId: ensEthereumChainId }}
					layout={EntityLayout.Summary}
					open={false}
				/>
			</section>

			<EvmContractView
				entityId={contractId}
				title="Resolver contract"
			/>
		{:else}
			<p data-text="muted">
				No resolver contract on the Voltaire ENS row for
				<span data-text="font-monospace">{entityId.name}</span>
				yet.
			</p>
		{/if}
	{/snippet}
</ResourceBoundary>

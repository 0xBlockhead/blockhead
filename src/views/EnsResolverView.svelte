<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { ChainId } from '$/constants/ChainId.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
	}: {
		selection: EntityProxyResource<typeof schema, EntityType.EnsName>
	} = $props()


	


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<ResourceBoundary
	placeholderText="Loading resolver…"
	resource={selection(
			({ sources: [Source.TheGraph_Graphql], fields: { $resolverContract: true } }),
		)}
>
	{#snippet children(ens)}
		{@const contractId = ens.fields.$resolverContract?.[EntityMetaKey.Selector]}
		{#if contractId}
			<section>
				<EvmNetworkView
					selection={select(EntityType.EvmNetwork, {
						caip2: {
							namespace: 'eip155',
							reference: String(ChainId.Ethereum),
						},
					})}
					layout={EntityLayout.Summary}

				/>
			</section>

			<EvmContractView
				selection={select(EntityType.EvmContract, contractId)}
				layout={EntityLayout.Summary}
				title="Resolver contract"
			/>
		{:else}
			<p data-text="muted">
				No resolver contract on the ENS subgraph row for
				<span data-text="font-monospace">{selection.entitySelector.name}</span>
				yet.
			</p>
		{/if}
	{/snippet}
</ResourceBoundary>

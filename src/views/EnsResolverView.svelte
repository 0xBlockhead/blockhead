<script lang="ts">
	// Types/constants
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { ensEthereumChainId } from '$/constants/Ens.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'


	// State
	let {
		selector,
	}: {
		selector: EntitySelector<typeof schema, EntityType.EnsName>
	} = $props()

	const ens = subscribe(EntityType.EnsName,
		selector,
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
		{@const contractId = ens.fields.$resolverContract?.[EntityMetaKey.Selector]}
		{#if contractId}
			<section>
				<EvmNetworkView
					selector={{ chainId: ensEthereumChainId }}
					layout={EntityLayout.Summary}
					open={false}
				/>
			</section>

			<EvmContractView
				selector={contractId}
				title="Resolver contract"
			/>
		{:else}
			<p data-text="muted">
				No resolver contract on the Voltaire ENS row for
				<span data-text="font-monospace">{selector.name}</span>
				yet.
			</p>
		{/if}
	{/snippet}
</ResourceBoundary>

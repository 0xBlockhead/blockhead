<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { ensEthereumChainId } from '$/constants/Ens.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href,
	}: {
		entityId: EntityId<typeof schema, EntityType.EnsName>
		href: string
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const ens = useEntity(
		EntityType.EnsName,
		entityId,
		{
			$: [Source.Voltaire_JsonRpc],
			$resolverContract: {},
		},
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<ResourceBoundary
	placeholderText="Loading resolver…"
	resource={ens}
>
	{#snippet children(ens)}
		{@const contractId = ens.$resolverContract?.[EntityMetaKey.Id]}
		{#if contractId}
			<section>
				<NetworkView
					entityId={{ chainId: ensEthereumChainId }}
					href={resolve('/(explore)/(networks)/network/[networkId]', {
						networkId: String(ensEthereumChainId),
					})}
					layout={EntityLayout.Summary}
					open={false}
				/>
			</section>

			<EvmContractView
				entityId={contractId}
				{href}
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

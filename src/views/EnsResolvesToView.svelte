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


	// State
	let {
		entityId,
	}: {
		entityId: EntityId<typeof schema, EntityType.EnsName>
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const ens = useEntity(
		EntityType.EnsName,
		entityId,
		{
			$: [Source.Voltaire_JsonRpc],
			$resolvedActor: {},
		},
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<ResourceBoundary
	placeholderText="Loading forward resolution…"
	resource={ens}
>
	{#snippet children(ens)}
		{@const resolvedActorId = ens.$resolvedActor?.[EntityMetaKey.Id]}
		{#if resolvedActorId}
			<section>
				<EvmNetworkView
					entityId={{ chainId: ensEthereumChainId }}
					layout={EntityLayout.Summary}
					open={false}
				/>
			</section>

			<!-- href override: card links to this resolves-to page, not /account/… -->
			<EvmAccountView
				entityId={resolvedActorId}
				href={resolve(
					'/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to',
					{ ensName: entityId.name },
				)}
				title="Addr record"
			/>
		{:else}
			<p data-text="muted">
				No forward resolution on the Voltaire ENS row for
				<span data-text="font-monospace">{entityId.name}</span>
				yet.
			</p>
		{/if}
	{/snippet}
</ResourceBoundary>

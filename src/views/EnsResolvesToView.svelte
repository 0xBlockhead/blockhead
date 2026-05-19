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
			$resolvedActor: {},
		},
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ActorView from '$/views/ActorView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<ResourceBoundary
	placeholderText="Loading forward resolution…"
	resource={ens}
>
	{#snippet children(ens)}
		{@const resolvedActorId = ens.$resolvedActor?.[EntityMetaKey.Id]}
		{#if resolvedActorId}
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

			<ActorView
				entityId={resolvedActorId}
				{href}
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

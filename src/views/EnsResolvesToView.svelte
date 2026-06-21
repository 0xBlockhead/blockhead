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
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
	}: {
		selection: EntityProxyResource<typeof schema, EntityType.EnsName>
	} = $props()


	


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<ResourceBoundary
	placeholderText="Loading forward resolution…"
	resource={selection(
			({ sources: [Source.TheGraph_Graphql], fields: { $subgraphResolvedActor: true } }),
		)}
>
	{#snippet children(ens)}
		{@const resolvedActorId = ens.$subgraphResolvedActor?.[EntityMetaKey.Selector]}
		{#if resolvedActorId}
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

			<!-- href override: card links to this resolves-to page, not /account/… -->
			<EvmAccountView
				selection={select(EntityType.EvmAccount, resolvedActorId)}
				href={resolve(
					'/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to',
					{ ensName: selection.entitySelector.name },
				)}
				layout={EntityLayout.Summary}
				title="Addr record"
			/>
		{:else}
			<p data-text="muted">
				No forward resolution on the ENS subgraph row for
				<span data-text="font-monospace">{selection.entitySelector.name}</span>
				yet.
			</p>
		{/if}
	{/snippet}
</ResourceBoundary>

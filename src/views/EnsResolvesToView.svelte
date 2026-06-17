<script lang="ts">
	// Types/constants
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { ChainId } from '$/constants/ChainId.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
	}: {
		selector: EntitySelector<typeof schema, EntityType.EnsName>
	} = $props()

	


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<ResourceBoundary
	placeholderText="Loading forward resolution…"
	resource={proxy(EntityType.EnsName,
			selector,
			({ sources: [Source.Voltaire_JsonRpc], fields: { $resolvedActor: true } }),
		)}
>
	{#snippet children(ens)}
		{@const resolvedActorId = ens.fields.$resolvedActor?.[EntityMetaKey.Selector]}
		{#if resolvedActorId}
			<section>
				<EvmNetworkView
					selector={{ chainId: ChainId.Ethereum }}
					layout={EntityLayout.Summary}

				/>
			</section>

			<!-- href override: card links to this resolves-to page, not /account/… -->
			<EvmAccountView
				selector={resolvedActorId}
				href={resolve(
					'/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to',
					{ ensName: selector.name },
				)}
				title="Addr record"
			/>
		{:else}
			<p data-text="muted">
				No forward resolution on the Voltaire ENS row for
				<span data-text="font-monospace">{selector.name}</span>
				yet.
			</p>
		{/if}
	{/snippet}
</ResourceBoundary>

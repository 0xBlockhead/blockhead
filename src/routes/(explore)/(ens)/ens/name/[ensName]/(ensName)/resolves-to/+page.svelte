<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { ensEthereumChainId } from '$/constants/Ens.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'

	import { EntityLayout } from '$/components/EntityView.svelte'
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ActorView from '$/views/ActorView.svelte'
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
			$resolvedActor: {},
		},
	)
</script>


<Page>
	<ResourceBoundary
		resource={ensName}
	>
		{#snippet children(live)}
			{@const resolvedActorId = live.$resolvedActor?.[EntityMetaKey.Id]}
			{#if resolvedActorId}
				<section>
					<NetworkView
						entityId={{
							chainId: ensEthereumChainId,
						}}
						href={resolve('/(explore)/(networks)/network/[networkId]', {
							networkId: String(ensEthereumChainId),
						})}
						layout={EntityLayout.Summary}
						open={false}
					/>
				</section>

				<ActorView
					entityId={resolvedActorId}
					href={resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolves-to', {
						ensName: params.ensName,
					})}
				/>
			{:else}
				<p data-text="muted">
					No forward resolution on the Voltaire ENS row for <span data-text="font-monospace">{params.ensName}</span> yet.
				</p>
			{/if}
		{/snippet}
	</ResourceBoundary>
</Page>

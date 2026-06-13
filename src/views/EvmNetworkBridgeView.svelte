<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityId,
		href = entityId.url,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmNetworkBridge>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const bridge = subscribe(EntityType.EvmNetworkBridge,
		entityId,
		({ sources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			], fields: { ...(open && ({ relationshipType: true })) } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkBridge}
	{entityId}
	href={href}
	bind:open
	title={`Execution bridge ${entityId.$fromNetwork.caip2.namespace}:${entityId.$fromNetwork.caip2.reference} → ${entityId.$toNetwork.caip2.namespace}:${entityId.$toNetwork.caip2.reference}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{entityId.url}
		</span>
	{/snippet}

	{#snippet Title()}
		<span>
			Execution bridge {entityId.$fromNetwork.caip2.namespace}:{entityId.$fromNetwork.caip2.reference} → {entityId.$toNetwork.caip2.namespace}:{entityId.$toNetwork.caip2.reference}
		</span>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>From</dt>
				<dd>
					{entityId.$fromNetwork.caip2.namespace}:{entityId.$fromNetwork.caip2.reference}
				</dd>
			</div>
			<div>
				<dt>To</dt>
				<dd>
					{entityId.$toNetwork.caip2.namespace}:{entityId.$toNetwork.caip2.reference}
				</dd>
			</div>
			<div>
				<dt>URL</dt>
				<dd>
					<a
						href={entityId.url}
						rel="noreferrer"
						target="_blank"
					>
						{entityId.url}
					</a>
				</dd>
			</div>
			{#if open}
				<ResourceBoundary
					placeholderText="Loading Chainlist / Ethereum Lists bridge mapping…"
					resource={bridge}
				>
					{#snippet children(bridge)}
						<div>
							<dt>Relationship</dt>
							<dd>{bridge.fields.relationshipType}</dd>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>

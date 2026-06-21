<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		href = selection.entitySelector.url,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkBridge>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	const relationshipType = $derived(((selection({
			sources: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
		},
	))).relationshipType)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkBridge}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	title={`Execution bridge ${selection.entitySelector.$fromNetwork.caip2.namespace}:${selection.entitySelector.$fromNetwork.caip2.reference} → ${selection.entitySelector.$toNetwork.caip2.namespace}:${selection.entitySelector.$toNetwork.caip2.reference}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selection.entitySelector.url}
		</span>
	{/snippet}

	{#snippet Title()}
		<span>
			Execution bridge {selection.entitySelector.$fromNetwork.caip2.namespace}:{selection.entitySelector.$fromNetwork.caip2.reference} → {selection.entitySelector.$toNetwork.caip2.namespace}:{selection.entitySelector.$toNetwork.caip2.reference}
		</span>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>From</dt>
				<dd>
					{selection.entitySelector.$fromNetwork.caip2.namespace}:{selection.entitySelector.$fromNetwork.caip2.reference}
				</dd>
			</div>
			<div>
				<dt>To</dt>
				<dd>
					{selection.entitySelector.$toNetwork.caip2.namespace}:{selection.entitySelector.$toNetwork.caip2.reference}
				</dd>
			</div>
			<div>
				<dt>URL</dt>
				<dd>
					<a
						href={selection.entitySelector.url}
						rel="noreferrer"
						target="_blank"
					>
						{selection.entitySelector.url}
					</a>
				</dd>
			</div>
			{#if open}
				<ResourceBoundary
					placeholderText="Loading Chainlist / Ethereum Lists bridge mapping…"
					resource={relationshipType}
				>
					{#snippet children(relationshipType)}
						<div>
							<dt>Relationship</dt>
							<dd>{relationshipType}</dd>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>

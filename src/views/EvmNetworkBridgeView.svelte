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
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		resource,
		href = selector.url,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EvmNetworkBridge>
			resource?: EntityProxyResource<typeof schema, EntityType.EvmNetworkBridge>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	
	const relationshipType = $derived(((resource ?? proxy(
		EntityType.EvmNetworkBridge,
		selector,
		{
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
	entitySelector={selector}
	href={href}
	bind:open
	title={`Execution bridge ${selector.$fromNetwork.caip2.namespace}:${selector.$fromNetwork.caip2.reference} → ${selector.$toNetwork.caip2.namespace}:${selector.$toNetwork.caip2.reference}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selector.url}
		</span>
	{/snippet}

	{#snippet Title()}
		<span>
			Execution bridge {selector.$fromNetwork.caip2.namespace}:{selector.$fromNetwork.caip2.reference} → {selector.$toNetwork.caip2.namespace}:{selector.$toNetwork.caip2.reference}
		</span>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>From</dt>
				<dd>
					{selector.$fromNetwork.caip2.namespace}:{selector.$fromNetwork.caip2.reference}
				</dd>
			</div>
			<div>
				<dt>To</dt>
				<dd>
					{selector.$toNetwork.caip2.namespace}:{selector.$toNetwork.caip2.reference}
				</dd>
			</div>
			<div>
				<dt>URL</dt>
				<dd>
					<a
						href={selector.url}
						rel="noreferrer"
						target="_blank"
					>
						{selector.url}
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

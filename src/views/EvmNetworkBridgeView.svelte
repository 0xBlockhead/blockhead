<script lang="ts">
	// Types/constants
	import { caip2RouteParamsFromNetworkId } from '$/lib/caip.ts'


	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/bridge/[bridgeId]',
			{
				...caip2RouteParamsFromNetworkId(entityId.$network),
				bridgeId: entityId.bridgeId,
			},
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmNetworkBridge>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const bridge = useEntity(
		EntityType.EvmNetworkBridge,
		entityId,
		{
			$: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
			...(open && {
				relationshipType: {},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkBridge}
	{entityId}
	href={href}
	bind:open
	title={`Execution bridge Chain ${String(entityId.$fromNetwork.chainId)} → Chain ${String(entityId.$toNetwork.chainId)}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{entityId.bridgeId}
		</span>
	{/snippet}

	{#snippet Title()}
		<span>
			Execution bridge Chain {String(entityId.$fromNetwork.chainId)} → Chain {String(entityId.$toNetwork.chainId)}
		</span>
	{/snippet}

	{#snippet Heading()}
		{@render Title()}
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>From</dt>
				<dd>
					Chain {String(entityId.$fromNetwork.chainId)}
				</dd>
			</div>
			<div>
				<dt>To</dt>
				<dd>
					Chain {String(entityId.$toNetwork.chainId)}
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
							<dd>{bridge.relationshipType}</dd>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
	{/snippet}
</EntityView>

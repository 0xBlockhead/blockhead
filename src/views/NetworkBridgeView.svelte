<script lang="ts">
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
			'/(explore)/(networks)/network/[networkId]/(network)/bridge/[bridgeId]',
			{
				networkId: String(entityId.$network.chainId),
				bridgeId: entityId.bridgeId,
			},
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.NetworkBridge>
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
		EntityType.NetworkBridge,
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
	entityType={EntityType.NetworkBridge}
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
				<dt>From (execution-layer chain)</dt>
				<dd>
					Chain {String(entityId.$fromNetwork.chainId)}
				</dd>
			</div>
			<div>
				<dt>To (execution-layer chain)</dt>
				<dd>
					Chain {String(entityId.$toNetwork.chainId)}
				</dd>
			</div>
			<div>
				<dt>Bridge endpoint (catalog URL)</dt>
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
					{#snippet children(loadedBridge)}
						<div>
							<dt>Relationship</dt>
							<dd>{loadedBridge.relationshipType}</dd>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.NetworkBridge}
			{entityId}
		/>
	{/snippet}
</EntityView>

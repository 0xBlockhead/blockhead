<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		entityId,
		href = entityId.url,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.NetworkBridge>
			href?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Heading'
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
	{href}
	bind:open
	title={`Network bridge pairing · Chainlist/Ethereum Lists · execution ${String(entityId.$fromNetwork.chainId)} → ${String(entityId.$toNetwork.chainId)}`}
	{...entityViewRest}
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.bridgeId}
		</span>
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
					{#snippet children(b)}
						<div>
							<dt>Relationship</dt>
							<dd>{b.relationshipType}</dd>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.NetworkBridge}
			{entityId}
		/>
	{/snippet}
</EntityView>

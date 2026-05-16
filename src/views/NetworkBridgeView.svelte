<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'


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


	const bridge = useEntity(
		EntityType.NetworkBridge,
		entityId,
		{
			$: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
			relationshipType: {},
		},
	)
</script>


<EntityView
	{...entityViewRest}
	entityType={EntityType.NetworkBridge}
	{entityId}
	{href}
	{open}
	title={`Bridge to chain ${String(entityId.$toNetwork.chainId)}`}
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.bridgeId}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>From network</dt>
				<dd>
					Chain {String(entityId.$fromNetwork.chainId)}
				</dd>
			</div>
			<div>
				<dt>To network</dt>
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
			<ResourceBoundary resource={bridge}>
				{#snippet children(b)}
					<div>
						<dt>Relationship type</dt>
						<dd>{b.relationshipType}</dd>
					</div>
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.NetworkBridge}
			{entityId}
		/>
	{/snippet}
</EntityView>

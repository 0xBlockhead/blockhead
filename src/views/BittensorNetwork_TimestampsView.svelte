<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Network snapshots',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BittensorNetwork_Timestamp>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BittensorNetwork_TimestampView from '$/views/BittensorNetwork_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BittensorNetwork_Timestamp}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Network snapshots capture observed Subtensor state such as finalized block, runtime, peer, subnet, and metagraph byte metrics at a resolver timestamp.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: [Source.Bittensor_JsonRpc],
						limit: 16,
					})}
				placeholderText="Loading metric snapshots…"
			>
				{#snippet children(timestamps)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.BittensorNetwork_Timestamp}
						id={`${id}-items`}
						href={href}
						open={true}
						items={timestamps.values}
						getKey={(timestamp) => stringify(timestamp.entitySelector)}
						getSortValue={(timestamp) => -timestamp.entitySelector.timestampMs}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Item({ item })}
							<BittensorNetwork_TimestampView
								selection={select(EntityType.BittensorNetwork_Timestamp, item.entitySelector)}
								layout={EntityLayout.Summary}
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>

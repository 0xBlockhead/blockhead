<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
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
		title = 'Metagraph snapshots',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
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
	import BittensorMetagraph_TimestampView from '$/views/BittensorMetagraph_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BittensorMetagraph_Timestamp}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Metagraph snapshots are as-of observations for a subnet's neuron graph payload and neuron count.
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
						entityType={EntityType.BittensorMetagraph_Timestamp}
						id={`${id}-items`}
						href={href}
						open={true}
						items={timestamps.entities}
						getKey={(timestamp) => stringify(timestamp.entitySelector)}
						getSortValue={(timestamp) => -timestamp.entitySelector.timestampMs}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Item({ item })}
							<BittensorMetagraph_TimestampView
								selector={item.entitySelector}
								{href}
								layout={EntityLayout.Summary}

								showTypeAnnotation={false}
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>

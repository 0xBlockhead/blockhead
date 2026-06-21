<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.FilecoinNetwork_Timestamp>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FilecoinNetwork_TimestampView from '$/views/FilecoinNetwork_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.FilecoinNetwork_Timestamp}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Filecoin network snapshots capture observed chain head, network version, node version, block delay, and raw/quality-adjusted power.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [
						Source.Lotus_JsonRpc,
						Source.Filfox_Rest,
					],
					limit: 16,
				})} placeholderText="Loading network snapshots…">
				{#snippet children(timestamps)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.FilecoinNetwork_Timestamp}
						id={`${id}-items`}
						href={href}
						getKey={(timestamp) => stringify(timestamp.entitySelector)}
						getSortValue={(timestamp) => -timestamp.entitySelector.timestampMs}
						open={true}
						items={timestamps.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">No network snapshots yet.</p>
						{/snippet}
						{#snippet Item({ item })}
							<FilecoinNetwork_TimestampView
								selection={select(EntityType.FilecoinNetwork_Timestamp, item.entitySelector)}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>

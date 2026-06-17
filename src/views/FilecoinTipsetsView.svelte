<script lang="ts">
import { stringify } from 'devalue'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Tipsets',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.FilecoinTipset>
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
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
</script>


<EntitiesList
	entityType={EntityType.FilecoinTipset}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Filecoin tipsets group one or more blocks at the same epoch height in Expected Consensus.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector,
				).field(entityFieldReference.fieldName, {
					sources: [
						Source.Lotus_JsonRpc,
						Source.Filfox_Rest,
					],
					limit: 16,
				})} placeholderText="Loading tipsets…">
				{#snippet children(tipsets)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.FilecoinTipset}
				id={`${id}-items`}
				href={href}
				getKey={(tipset) => stringify(tipset.entitySelector)}
				getSortValue={(tipset) => -Number(tipset.entitySelector.height)}
				open={true}
				items={tipsets.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No recent tipsets yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<FilecoinTipsetView
						selector={item.entitySelector}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>

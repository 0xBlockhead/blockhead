<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.Lotus_JsonRpc,
							Source.Filfox_Rest,
						],
						limit: 16,
					},
				} }),
			)}
			{@const tipsets = derive(
				parent,
				(parent): readonly Entity<typeof schema, EntityType.FilecoinTipset>[] => (
					(parent.fields[entityFieldReference.fieldName]?.values ?? [])
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.FilecoinTipset}
				id={`${id}-items`}
				href={href}
				getKey={(tipset) => stringify(tipset[EntityMetaKey.Selector])}
				getSortValue={(tipset) => -Number(tipset[EntityMetaKey.Selector].height)}
				open={true}
				resource={tipsets}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No recent tipsets yet.
					</p>
				{/snippet}

				{#snippet Item(context)}
					<FilecoinTipsetView
						selector={context!.item[EntityMetaKey.Selector]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>

<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TezosBigMap>, 'prefetched'> = $props()

	const viewDomId = $derived('tezos-big-map-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TezosContractView from '$/views/TezosContractView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosBigMap}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>contract</dt>
				<dd>
					<TezosContractView
						selection={select(EntityType.TezosContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>big map ID</dt>
				<dd>
					{selection.entitySelector.bigMapId}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							path: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const path = entity.path}
					{#if path != null}
						<div>
							<dt>path</dt>
							<dd>
								{path}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-tezos-big-map-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'tezos-big-map-keys',
						label: 'Keys',
					},
					{
						id: 'tezos-big-map-updates',
						label: 'Updates',
					},
				]
			}
			data-card
			class='network-view-collapsible-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTezosBigMapKeys({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosBigMapKey}
					collapsible={false}
					title={label}
					emptyText='No keys.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$keys()}
				>
					{#snippet Item({ item: tezosBigMapKey })}
						<EntityView
							entityType={EntityType.TezosBigMapKey}
							entitySelector={tezosBigMapKey[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionTezosBigMapUpdates({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosBigMapDiff}
					collapsible={false}
					title={label}
					emptyText='No updates.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$updates()}
				>
					{#snippet Item({ item: tezosBigMapDiff })}
						<EntityView
							entityType={EntityType.TezosBigMapDiff}
							entitySelector={tezosBigMapDiff[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-tezos-big-map-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'tezos-big-map-timestamps',
						label: 'Timestamps',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionTezosBigMapTimestamps({ id, label })}
				<EntitiesList
					entityType={EntityType.TezosBigMap_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: tezosBigMapTimestamp })}
						<EntityView
							entityType={EntityType.TezosBigMap_Timestamp}
							entitySelector={tezosBigMapTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>

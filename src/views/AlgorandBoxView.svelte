<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AlgorandBox> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AlgorandBox_RoundsView from '$/views/AlgorandBox_RoundsView.svelte'
	import AlgorandApplicationView from '$/views/AlgorandApplicationView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandBox}
	entitySelector={selection.entitySelector}
	title={title ?? 'algorand box'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		algorand box
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>application</dt>
				<dd>
					<AlgorandApplicationView
						selection={select(EntityType.AlgorandApplication, selection.entitySelector.$application)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>box name</dt>
				<dd>
					{selection.entitySelector.boxName}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const roundsResource = selection.$$rounds}
		<ResourceBoundary
			resource={roundsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AlgorandBox_RoundsView
						selection={roundsResource}
						countResource={roundsResource.count}
						title='rounds'
						id='rounds'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>

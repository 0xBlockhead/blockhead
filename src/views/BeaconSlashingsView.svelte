<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Slashings',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BeaconSlashing>
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BeaconSlashingView from '$/views/BeaconSlashingView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BeaconSlashing}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Slashings penalize validators for attester or proposer faults in the loaded beacon scope.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: [Source.Beacon_Rest],
						limit: 16,
					})}
				placeholderText="Loading slashings…"
			>
				{#snippet children(slashings)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BeaconSlashing}
				id={`${id}-items`}
				href={href}
				getKey={(slashing) => `${String(slashing.entitySelector.slot)}:${slashing.entitySelector.kind}:${String(slashing.entitySelector.index)}`}
				items={slashings.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">No slashings in the loaded slot.</p>
				{/snippet}

				{#snippet Item({ item: slashing })}
					<BeaconSlashingView
						selection={select(EntityType.BeaconSlashing, slashing.entitySelector)}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>

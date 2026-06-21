<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type BeaconEpochsResource = EntityProxyFieldResource<
		typeof schema,
		EntityType.EvmNetwork,
		'$$beaconEpochs'
	>

	// State
	let {
		selection,
		title = 'Epochs',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: BeaconEpochsResource
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
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BeaconEpoch}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Beacon epochs group consecutive consensus slots into fixed spans (32 slots per epoch on Ethereum mainnet—check the deployment you are on).
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={selection}
				placeholderText="Loading epochs…"
			>
				{#snippet children(epochs)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BeaconEpoch}
				id={`${id}-items`}
				href={href}
				getKey={(epoch) => stringify(epoch.entitySelector)}
				getSortValue={(epoch) => -Number(epoch.entitySelector.epoch)}
				items={epochs.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No epochs yet.
					</p>
				{/snippet}

				{#snippet Item({ item: epoch })}
					<BeaconEpochView
						selection={select(EntityType.BeaconEpoch, epoch.entitySelector)}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>

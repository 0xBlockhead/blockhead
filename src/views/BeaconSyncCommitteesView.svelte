<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Sync committees',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BeaconSyncCommittee>
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
	import BeaconSyncCommitteeView from '$/views/BeaconSyncCommitteeView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BeaconSyncCommittee}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			The sync committee attests to light-client updates for the current sync period near chain head.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: [Source.Beacon_Rest],
						limit: 4,
					})}
				placeholderText="Loading committees…"
			>
				{#snippet children(committees)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BeaconSyncCommittee}
				id={`${id}-items`}
				href={href}
				getKey={(committee) => stringify(committee.entitySelector)}
				items={committees.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">No sync committee loaded yet.</p>
				{/snippet}

				{#snippet Item({ item: committee })}
					<BeaconSyncCommitteeView
						selection={select(EntityType.BeaconSyncCommittee, committee.entitySelector)}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>

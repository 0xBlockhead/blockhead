<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		entityFieldReference,
		title = 'Attestations',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.BeaconAttestation>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()

	import { proxy } from '$/routes/+layout.svelte'

	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BeaconAttestationView from '$/views/BeaconAttestationView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BeaconAttestation}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Attestations are votes from committees on the validity of a beacon block in a slot.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={proxy(
						entityFieldReference.entityType,
						entityFieldReference.selector,
					).field(entityFieldReference.fieldName, {
						sources: [Source.Beacon_Rest],
						limit: 16,
					})}
				placeholderText="Loading attestations…"
			>
				{#snippet children(attestations)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BeaconAttestation}
				id={`${id}-items`}
				href={href}
				getKey={(attestation) => stringify(attestation.entitySelector)}
				open={true}
				items={attestations.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">No attestations loaded yet.</p>
				{/snippet}

				{#snippet Item({ item: attestation })}
					<BeaconAttestationView
						selector={attestation.entitySelector}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>

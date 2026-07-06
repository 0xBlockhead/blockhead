<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Beacon validator observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconValidator_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BeaconValidator_Timestamp>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BeaconValidator_TimestampView from '$/views/BeaconValidator_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					slot: true,
					status: true,
					$validator: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconValidator_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(beaconValidatorTimestamps)}
			{@const uniqueBeaconValidatorTimestamps = [...new Map(beaconValidatorTimestamps.values.map((beaconValidatorTimestamp) => [beaconValidatorTimestamp[EntityMetaKey.SelectorKey], beaconValidatorTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconValidator_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={beaconValidatorTimestamps.totalCount}
				getKey={(beaconValidatorTimestamp) => beaconValidatorTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueBeaconValidatorTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Beacon validator observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: beaconValidatorTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BeaconValidator_Timestamp> })}
					{@const beaconValidatorTimestampFields = { ...beaconValidatorTimestamp[EntityMetaKey.Selector], ...beaconValidatorTimestamp }}
					{@const beaconValidatorTimestampHrefFields = { ...beaconValidatorTimestamp, ...beaconValidatorTimestamp[EntityMetaKey.Selector] }}
					<BeaconValidator_TimestampView
						selection={select(EntityType.BeaconValidator_Timestamp, beaconValidatorTimestamp[EntityMetaKey.Selector])}
						prefetched={beaconValidatorTimestampFields}
						href={
							(beaconValidatorTimestampHrefFields.$validator !== undefined && beaconValidatorTimestampHrefFields.$validator.$network !== undefined && beaconValidatorTimestampHrefFields.$validator.$network.caip2 !== undefined && beaconValidatorTimestampHrefFields.$validator.$network.caip2.namespace !== undefined && beaconValidatorTimestampHrefFields.$validator !== undefined && beaconValidatorTimestampHrefFields.$validator.$network !== undefined && beaconValidatorTimestampHrefFields.$validator.$network.caip2 !== undefined && beaconValidatorTimestampHrefFields.$validator.$network.caip2.reference !== undefined && beaconValidatorTimestampHrefFields.$validator !== undefined && beaconValidatorTimestampHrefFields.$validator.indexInNetwork !== undefined && beaconValidatorTimestampHrefFields.slot !== undefined && beaconValidatorTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/validator/[validatorIndex=nonNegativeInteger]/observations/[slot=nonNegativeInteger]/[source]', {
								caip2: `${String(beaconValidatorTimestampHrefFields.$validator.$network.caip2.namespace ?? '')}:${String(beaconValidatorTimestampHrefFields.$validator.$network.caip2.reference ?? '')}`,
								validatorIndex: String(beaconValidatorTimestampHrefFields.$validator.indexInNetwork ?? ''),
								slot: String(beaconValidatorTimestampHrefFields.slot ?? ''),
								source: String(beaconValidatorTimestampHrefFields.source ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.BeaconValidator_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

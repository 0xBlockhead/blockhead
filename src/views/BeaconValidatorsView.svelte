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
		title = 'Validators',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconValidators-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BeaconValidator>
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
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
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
					indexInNetwork: true,
					status: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconValidator}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(beaconValidators)}
			{@const uniqueBeaconValidators = [...new Map(beaconValidators.values.map((beaconValidator) => [beaconValidator[EntityMetaKey.SelectorKey], beaconValidator])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconValidator}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={beaconValidators.totalCount}
				getKey={(beaconValidator) => beaconValidator[EntityMetaKey.SelectorKey]}
				items={uniqueBeaconValidators}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Beacon validators yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: beaconValidator }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BeaconValidator> })}
					{@const beaconValidatorFields = { ...beaconValidator[EntityMetaKey.Selector], ...beaconValidator }}
					{@const beaconValidatorHrefFields = { ...beaconValidator, ...beaconValidator[EntityMetaKey.Selector] }}
					<BeaconValidatorView
						selection={select(EntityType.BeaconValidator, beaconValidator[EntityMetaKey.Selector])}
						prefetched={beaconValidatorFields}
						href={
							(beaconValidatorHrefFields.$network !== undefined && beaconValidatorHrefFields.$network.caip2 !== undefined && beaconValidatorHrefFields.$network.caip2.namespace !== undefined && beaconValidatorHrefFields.$network !== undefined && beaconValidatorHrefFields.$network.caip2 !== undefined && beaconValidatorHrefFields.$network.caip2.reference !== undefined && beaconValidatorHrefFields.indexInNetwork !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/validator/[validatorIndex=nonNegativeInteger]', {
								caip2: `${String(beaconValidatorHrefFields.$network.caip2.namespace ?? '')}:${String(beaconValidatorHrefFields.$network.caip2.reference ?? '')}`,
								validatorIndex: String(beaconValidatorHrefFields.indexInNetwork ?? ''),
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
		entityType={EntityType.BeaconValidator}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

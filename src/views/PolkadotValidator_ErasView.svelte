<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
		title = 'Validator eras',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotValidator_Eras-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.PolkadotValidator_Era>
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
	import PolkadotValidator_EraView from '$/views/PolkadotValidator_EraView.svelte'
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
					eraIndex: true,
					active: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(polkadotValidatorEras)}
			{@const uniquePolkadotValidatorEras = [...new Map(polkadotValidatorEras.values.map((polkadotValidatorEra) => [polkadotValidatorEra[EntityMetaKey.SelectorKey], polkadotValidatorEra])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotValidator_Era}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={polkadotValidatorEras.totalCount}
				getKey={(polkadotValidatorEra) => polkadotValidatorEra[EntityMetaKey.SelectorKey]}
				items={uniquePolkadotValidatorEras}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Polkadot validator eras yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: polkadotValidatorEra }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.PolkadotValidator_Era> })}
					{@const polkadotValidatorEraFields = { ...polkadotValidatorEra[EntityMetaKey.Selector], ...polkadotValidatorEra }}
					<PolkadotValidator_EraView
						selection={select(EntityType.PolkadotValidator_Era, polkadotValidatorEra[EntityMetaKey.Selector])}
						prefetched={polkadotValidatorEraFields}
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
		entityType={EntityType.PolkadotValidator_Era}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Validators',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosValidators-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CosmosValidator>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosValidator}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				moniker: true,
				operatorAddress: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cosmosValidators) => [...new Map(cosmosValidators.values.map((cosmosValidator) => [cosmosValidator[EntityMetaKey.SelectorKey], cosmosValidator])).values()]}
	getKey={(cosmosValidator) => cosmosValidator[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cosmos validators yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cosmosValidator })}
		{@const cosmosValidatorFields = { ...cosmosValidator[EntityMetaKey.Selector], ...cosmosValidator }}
		<EntityView
			entityType={EntityType.CosmosValidator}
			entitySelector={cosmosValidator[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((cosmosValidatorFields.moniker) ?? ''), String((cosmosValidatorFields.operatorAddress) ?? '')].filter(Boolean).join(' ') || 'Cosmos validator'}
			{/snippet}

			{#snippet Value()}
				{[String((cosmosValidatorFields.operatorAddress) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((cosmosValidatorFields.$network.name) ?? '')].filter(Boolean).join(' ') || [cosmosValidatorFields.$network.caip2 == null ? '' : String(`${(cosmosValidatorFields.$network.caip2).namespace}:${(cosmosValidatorFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

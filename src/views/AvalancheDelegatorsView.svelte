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
		title = 'Avalanche delegators',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AvalancheDelegators-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AvalancheDelegator>
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
	entityType={EntityType.AvalancheDelegator}
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
				delegatorAddress: true,
				stakeAmountNavax: true,
				txId: true,
			},
		})
	}
	{countResource}
	getResourceItems={(avalancheDelegators) => [...new Map(avalancheDelegators.values.map((avalancheDelegator) => [avalancheDelegator[EntityMetaKey.SelectorKey], avalancheDelegator])).values()]}
	getKey={(avalancheDelegator) => avalancheDelegator[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Avalanche delegators yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: avalancheDelegator })}
		{@const avalancheDelegatorFields = { ...avalancheDelegator[EntityMetaKey.Selector], ...avalancheDelegator }}
		<EntityView
			entityType={EntityType.AvalancheDelegator}
			entitySelector={avalancheDelegator[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((avalancheDelegatorFields.delegatorAddress) ?? '')].filter(Boolean).join(' ') || [String((avalancheDelegatorFields.txId) ?? '')].filter(Boolean).join(' ') || 'avalanche delegator'}
			{/snippet}

			{#snippet Value()}
				{[String((avalancheDelegatorFields.stakeAmountNavax) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

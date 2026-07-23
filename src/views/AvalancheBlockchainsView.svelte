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
		title = 'Avalanche blockchains',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AvalancheBlockchains-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AvalancheBlockchain>
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
	entityType={EntityType.AvalancheBlockchain}
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
				chainName: true,
				chainAlias: true,
				vmId: true,
				blockchainId: true,
			},
		})
	}
	{countResource}
	getResourceItems={(avalancheBlockchains) => [...new Map(avalancheBlockchains.values.map((avalancheBlockchain) => [avalancheBlockchain[EntityMetaKey.SelectorKey], avalancheBlockchain])).values()]}
	getKey={(avalancheBlockchain) => avalancheBlockchain[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Avalanche blockchains yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: avalancheBlockchain })}
		{@const avalancheBlockchainFields = { ...avalancheBlockchain[EntityMetaKey.Selector], ...avalancheBlockchain }}
		<EntityView
			entityType={EntityType.AvalancheBlockchain}
			entitySelector={avalancheBlockchain[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((avalancheBlockchainFields.chainName) ?? ''), String((avalancheBlockchainFields.chainAlias) ?? '')].filter(Boolean).join(' ') || [String((avalancheBlockchainFields.blockchainId) ?? '')].filter(Boolean).join(' ') || 'avalanche blockchain'}
			{/snippet}

			{#snippet Value()}
				{[String((avalancheBlockchainFields.vmId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

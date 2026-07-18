<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.AvalancheBlockchain>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import AvalancheBlockchainView from '$/views/AvalancheBlockchainView.svelte'
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
		{@const selection = select(EntityType.AvalancheBlockchain, avalancheBlockchain[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<AvalancheBlockchainView
			selection={selection}
			prefetched={avalancheBlockchainFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

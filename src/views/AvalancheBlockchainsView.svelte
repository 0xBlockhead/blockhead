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
		title = 'Avalanche blockchains',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AvalancheBlockchains-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AvalancheBlockchain>
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
	import AvalancheBlockchainView from '$/views/AvalancheBlockchainView.svelte'
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
					chainName: true,
					chainAlias: true,
					vmId: true,
					blockchainId: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(avalancheBlockchains)}
			{@const uniqueAvalancheBlockchains = [...new Map(avalancheBlockchains.values.map((avalancheBlockchain) => [avalancheBlockchain[EntityMetaKey.SelectorKey], avalancheBlockchain])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AvalancheBlockchain}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={avalancheBlockchains.totalCount}
				getKey={(avalancheBlockchain) => avalancheBlockchain[EntityMetaKey.SelectorKey]}
				items={uniqueAvalancheBlockchains}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Avalanche blockchains yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: avalancheBlockchain }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AvalancheBlockchain> })}
					{@const avalancheBlockchainFields = { ...avalancheBlockchain[EntityMetaKey.Selector], ...avalancheBlockchain }}
					<AvalancheBlockchainView
						selection={select(EntityType.AvalancheBlockchain, avalancheBlockchain[EntityMetaKey.Selector])}
						prefetched={avalancheBlockchainFields}
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
		entityType={EntityType.AvalancheBlockchain}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

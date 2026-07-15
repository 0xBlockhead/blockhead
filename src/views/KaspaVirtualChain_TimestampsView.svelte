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
		title = 'Kaspa virtual-chain observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'KaspaVirtualChain_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.KaspaVirtualChain_Timestamp>
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import KaspaVirtualChain_TimestampView from '$/views/KaspaVirtualChain_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={selection}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.KaspaVirtualChain_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(kaspaVirtualChainTimestamps)}
			{@const uniqueKaspaVirtualChainTimestamps = [...new Map(kaspaVirtualChainTimestamps.values.map((kaspaVirtualChainTimestamp) => [kaspaVirtualChainTimestamp[EntityMetaKey.SelectorKey], kaspaVirtualChainTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.KaspaVirtualChain_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={kaspaVirtualChainTimestamps.totalCount}
				getKey={(kaspaVirtualChainTimestamp) => kaspaVirtualChainTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueKaspaVirtualChainTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Kaspa virtual chain observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: kaspaVirtualChainTimestamp })}
					{@const kaspaVirtualChainTimestampFields = { ...kaspaVirtualChainTimestamp[EntityMetaKey.Selector], ...kaspaVirtualChainTimestamp }}
					{@const selection = select(EntityType.KaspaVirtualChain_Timestamp, kaspaVirtualChainTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					<KaspaVirtualChain_TimestampView
						selection={selection}
						prefetched={kaspaVirtualChainTimestampFields}
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
		entityType={EntityType.KaspaVirtualChain_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

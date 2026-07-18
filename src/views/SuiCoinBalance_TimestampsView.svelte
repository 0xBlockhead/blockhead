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
		title = 'Sui coin balance observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SuiCoinBalance_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SuiCoinBalance_Timestamp>
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
	import SuiCoinBalance_TimestampView from '$/views/SuiCoinBalance_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiCoinBalance_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
		})
	}
	getResourceItems={(suiCoinBalanceTimestamps) => [...new Map(suiCoinBalanceTimestamps.values.map((suiCoinBalanceTimestamp) => [suiCoinBalanceTimestamp[EntityMetaKey.SelectorKey], suiCoinBalanceTimestamp])).values()]}
	getKey={(suiCoinBalanceTimestamp) => suiCoinBalanceTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Sui coin balance observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: suiCoinBalanceTimestamp })}
		{@const suiCoinBalanceTimestampFields = { ...suiCoinBalanceTimestamp[EntityMetaKey.Selector], ...suiCoinBalanceTimestamp }}
		{@const selection = select(EntityType.SuiCoinBalance_Timestamp, suiCoinBalanceTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<SuiCoinBalance_TimestampView
			selection={selection}
			prefetched={suiCoinBalanceTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

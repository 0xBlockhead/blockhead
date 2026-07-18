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
		title = 'Token program extensions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'TokenProgramExtension_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.TokenProgramExtension_Timestamp>
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
	import TokenProgramExtension_TimestampView from '$/views/TokenProgramExtension_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TokenProgramExtension_Timestamp}
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
				extensionKind: true,
				extensionScope: true,
				source: true,
			},
		})
	}
	getResourceItems={(tokenProgramExtensionTimestamps) => [...new Map(tokenProgramExtensionTimestamps.values.map((tokenProgramExtensionTimestamp) => [tokenProgramExtensionTimestamp[EntityMetaKey.SelectorKey], tokenProgramExtensionTimestamp])).values()]}
	getKey={(tokenProgramExtensionTimestamp) => tokenProgramExtensionTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Token program extension observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: tokenProgramExtensionTimestamp })}
		{@const tokenProgramExtensionTimestampFields = { ...tokenProgramExtensionTimestamp[EntityMetaKey.Selector], ...tokenProgramExtensionTimestamp }}
		{@const selection = select(EntityType.TokenProgramExtension_Timestamp, tokenProgramExtensionTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<TokenProgramExtension_TimestampView
			selection={selection}
			prefetched={tokenProgramExtensionTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

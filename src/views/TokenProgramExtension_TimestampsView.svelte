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
		title = 'Token program extensions',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'TokenProgramExtension_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.TokenProgramExtension_Timestamp>
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
	import TokenProgramExtension_TimestampView from '$/views/TokenProgramExtension_TimestampView.svelte'
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
					extensionKind: true,
					extensionScope: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.TokenProgramExtension_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(tokenProgramExtensionTimestamps)}
			{@const uniqueTokenProgramExtensionTimestamps = [...new Map(tokenProgramExtensionTimestamps.values.map((tokenProgramExtensionTimestamp) => [tokenProgramExtensionTimestamp[EntityMetaKey.SelectorKey], tokenProgramExtensionTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.TokenProgramExtension_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={tokenProgramExtensionTimestamps.totalCount}
				getKey={(tokenProgramExtensionTimestamp) => tokenProgramExtensionTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueTokenProgramExtensionTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Token program extension observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: tokenProgramExtensionTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.TokenProgramExtension_Timestamp> })}
					{@const tokenProgramExtensionTimestampFields = { ...tokenProgramExtensionTimestamp[EntityMetaKey.Selector], ...tokenProgramExtensionTimestamp }}
					<TokenProgramExtension_TimestampView
						selection={select(EntityType.TokenProgramExtension_Timestamp, tokenProgramExtensionTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={tokenProgramExtensionTimestampFields}
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
		entityType={EntityType.TokenProgramExtension_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

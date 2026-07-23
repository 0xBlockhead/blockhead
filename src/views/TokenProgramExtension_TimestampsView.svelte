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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.TokenProgramExtension_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.TokenProgramExtension_Timestamp}
			entitySelector={tokenProgramExtensionTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((tokenProgramExtensionTimestampFields.extensionKind) ?? '')].filter(Boolean).join(' ') || 'token program extension timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((tokenProgramExtensionTimestampFields.extensionScope) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((tokenProgramExtensionTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

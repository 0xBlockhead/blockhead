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
		title = 'Celestia namespaces',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CelestiaNamespaces-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CelestiaNamespace>
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
	entityType={EntityType.CelestiaNamespace}
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
				label: true,
				namespaceVersion: true,
				namespaceId: true,
			},
		})
	}
	{countResource}
	getResourceItems={(celestiaNamespaces) => [...new Map(celestiaNamespaces.values.map((celestiaNamespace) => [celestiaNamespace[EntityMetaKey.SelectorKey], celestiaNamespace])).values()]}
	getKey={(celestiaNamespace) => celestiaNamespace[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Celestia namespaces yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: celestiaNamespace })}
		{@const celestiaNamespaceFields = { ...celestiaNamespace[EntityMetaKey.Selector], ...celestiaNamespace }}
		<EntityView
			entityType={EntityType.CelestiaNamespace}
			entitySelector={celestiaNamespace[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((celestiaNamespaceFields.label) ?? '')].filter(Boolean).join(' ') || [String((celestiaNamespaceFields.namespaceId) ?? '')].filter(Boolean).join(' ') || 'celestia namespace'}
			{/snippet}

			{#snippet Value()}
				{[String((celestiaNamespaceFields.namespaceVersion) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

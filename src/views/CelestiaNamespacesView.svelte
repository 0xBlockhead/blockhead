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
		title = 'Celestia namespaces',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CelestiaNamespaces-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CelestiaNamespace>
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
	import CelestiaNamespaceView from '$/views/CelestiaNamespaceView.svelte'
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
					label: true,
					namespaceVersion: true,
					namespaceId: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(celestiaNamespaces)}
			{@const uniqueCelestiaNamespaces = [...new Map(celestiaNamespaces.values.map((celestiaNamespace) => [celestiaNamespace[EntityMetaKey.SelectorKey], celestiaNamespace])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CelestiaNamespace}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={celestiaNamespaces.totalCount}
				getKey={(celestiaNamespace) => celestiaNamespace[EntityMetaKey.SelectorKey]}
				items={uniqueCelestiaNamespaces}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Celestia namespaces yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: celestiaNamespace }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CelestiaNamespace> })}
					{@const celestiaNamespaceFields = { ...celestiaNamespace[EntityMetaKey.Selector], ...celestiaNamespace }}
					<CelestiaNamespaceView
						selection={select(EntityType.CelestiaNamespace, celestiaNamespace[EntityMetaKey.Selector])}
						prefetched={celestiaNamespaceFields}
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
		entityType={EntityType.CelestiaNamespace}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

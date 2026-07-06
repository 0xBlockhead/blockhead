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
		title = 'Username namespaces',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LensUsernameNamespaces-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.LensUsernameNamespace>
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
	import LensUsernameNamespaceView from '$/views/LensUsernameNamespaceView.svelte'
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
					namespace: true,
					tokenName: true,
					address: true,
					totalUsernames: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LensUsernameNamespace}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(lensUsernameNamespaces)}
			{@const uniqueLensUsernameNamespaces = [...new Map(lensUsernameNamespaces.values.map((lensUsernameNamespace) => [lensUsernameNamespace[EntityMetaKey.SelectorKey], lensUsernameNamespace])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LensUsernameNamespace}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={lensUsernameNamespaces.totalCount}
				getKey={(lensUsernameNamespace) => lensUsernameNamespace[EntityMetaKey.SelectorKey]}
				items={uniqueLensUsernameNamespaces}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Lens username namespaces yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: lensUsernameNamespace }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.LensUsernameNamespace> })}
					{@const lensUsernameNamespaceFields = { ...lensUsernameNamespace[EntityMetaKey.Selector], ...lensUsernameNamespace }}
					<LensUsernameNamespaceView
						selection={select(EntityType.LensUsernameNamespace, lensUsernameNamespace[EntityMetaKey.Selector])}
						prefetched={lensUsernameNamespaceFields}
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
		entityType={EntityType.LensUsernameNamespace}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

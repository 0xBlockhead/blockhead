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
		title = 'Username namespaces',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LensUsernameNamespaces-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.LensUsernameNamespace>
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
	import LensUsernameNamespaceView from '$/views/LensUsernameNamespaceView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LensUsernameNamespace}
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
				namespace: true,
				tokenName: true,
				address: true,
				totalUsernames: true,
			},
		})
	}
	getResourceItems={(lensUsernameNamespaces) => [...new Map(lensUsernameNamespaces.values.map((lensUsernameNamespace) => [lensUsernameNamespace[EntityMetaKey.SelectorKey], lensUsernameNamespace])).values()]}
	getKey={(lensUsernameNamespace) => lensUsernameNamespace[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Lens username namespaces yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: lensUsernameNamespace })}
		{@const lensUsernameNamespaceFields = { ...lensUsernameNamespace[EntityMetaKey.Selector], ...lensUsernameNamespace }}
		{@const selection = select(EntityType.LensUsernameNamespace, lensUsernameNamespace[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<LensUsernameNamespaceView
			selection={selection}
			prefetched={lensUsernameNamespaceFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

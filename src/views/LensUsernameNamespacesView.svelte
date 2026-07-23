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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LensUsernameNamespace>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.LensUsernameNamespace}
			entitySelector={lensUsernameNamespace[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((lensUsernameNamespaceFields.namespace) ?? ''), String((lensUsernameNamespaceFields.tokenName) ?? '')].filter(Boolean).join(' ') || 'Lens username namespace'}
			{/snippet}

			{#snippet Value()}
				{[String((lensUsernameNamespaceFields.address) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((lensUsernameNamespaceFields.totalUsernames) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		title = 'ENS names',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EnsNames-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EnsName>
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
	entityType={EntityType.EnsName}
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
				name: true,
			},
		})
	}
	{countResource}
	getResourceItems={(ensNames) => [...new Map(ensNames.values.map((ensName) => [ensName[EntityMetaKey.SelectorKey], ensName])).values()]}
	getKey={(ensName) => ensName[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ENS names yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ensName })}
		{@const ensNameFields = { ...ensName[EntityMetaKey.Selector], ...ensName }}
		<EntityView
			entityType={EntityType.EnsName}
			entitySelector={ensName[EntityMetaKey.Selector]}
			href={
				(
					ensName[EntityMetaKey.Selector] != null && 'name' in ensName[EntityMetaKey.Selector]
					&& ensName[EntityMetaKey.Selector].name != null ?
						resolve('/ens/name/[ensName=stringSegment]', {
					ensName: encodeURIComponent(String(ensName[EntityMetaKey.Selector].name ?? '')),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((ensNameFields.name) ?? '')].filter(Boolean).join(' ') || 'ENS name'}
			{/snippet}

			{#snippet Value()}
				{[String((ensNameFields.name) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

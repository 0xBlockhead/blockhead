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
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Reddit',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalRedditNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType._GlobalRedditNetwork>
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
	entityType={EntityType._GlobalRedditNetwork}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Reddit_PublicJson,
			],
			fields: {
				scope: true,
			},
		})
	}
	{countResource}
	getResourceItems={(globalRedditNetworks) => [...new Map(globalRedditNetworks.values.map((globalRedditNetwork) => [globalRedditNetwork[EntityMetaKey.SelectorKey], globalRedditNetwork])).values()]}
	getKey={(globalRedditNetwork) => globalRedditNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Reddit yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalRedditNetwork })}
		{@const globalRedditNetworkFields = { ...globalRedditNetwork[EntityMetaKey.Selector], ...globalRedditNetwork }}
		<EntityView
			entityType={EntityType._GlobalRedditNetwork}
			entitySelector={globalRedditNetwork[EntityMetaKey.Selector]}
			href={
				(
					globalRedditNetwork[EntityMetaKey.Selector].scope === '_GlobalRedditNetwork' ?
						resolve('/reddit')
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{'Reddit'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

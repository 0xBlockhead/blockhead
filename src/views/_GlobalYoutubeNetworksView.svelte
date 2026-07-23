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
		title = 'YouTube networks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalYoutubeNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType._GlobalYoutubeNetwork>
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
	entityType={EntityType._GlobalYoutubeNetwork}
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
				scope: true,
			},
		})
	}
	{countResource}
	getResourceItems={(globalYoutubeNetworks) => [...new Map(globalYoutubeNetworks.values.map((globalYoutubeNetwork) => [globalYoutubeNetwork[EntityMetaKey.SelectorKey], globalYoutubeNetwork])).values()]}
	getKey={(globalYoutubeNetwork) => globalYoutubeNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No YouTube networks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalYoutubeNetwork })}
		{@const globalYoutubeNetworkFields = { ...globalYoutubeNetwork[EntityMetaKey.Selector], ...globalYoutubeNetwork }}
		<EntityView
			entityType={EntityType._GlobalYoutubeNetwork}
			entitySelector={globalYoutubeNetwork[EntityMetaKey.Selector]}
			href={
				(
					globalYoutubeNetwork[EntityMetaKey.Selector].scope === '_GlobalYoutubeNetwork' ?
						resolve('/youtube')
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{['YouTube'].filter(Boolean).join(' ') || 'YouTube network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

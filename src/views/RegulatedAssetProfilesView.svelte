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
		title = 'Regulated asset profiles',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RegulatedAssetProfiles-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.RegulatedAssetProfile>
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
	entityType={EntityType.RegulatedAssetProfile}
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
				standard: true,
				$assetInstance: {
					fields: {
						symbol: true,
						name: true,
					},
				},
			},
		})
	}
	{countResource}
	getResourceItems={(regulatedAssetProfiles) => [...new Map(regulatedAssetProfiles.values.map((regulatedAssetProfile) => [regulatedAssetProfile[EntityMetaKey.SelectorKey], regulatedAssetProfile])).values()]}
	getKey={(regulatedAssetProfile) => regulatedAssetProfile[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Regulated asset profiles yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: regulatedAssetProfile })}
		{@const regulatedAssetProfileFields = { ...regulatedAssetProfile[EntityMetaKey.Selector], ...regulatedAssetProfile }}
		<EntityView
			entityType={EntityType.RegulatedAssetProfile}
			entitySelector={regulatedAssetProfile[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((regulatedAssetProfileFields.standard) ?? '')].filter(Boolean).join(' ') || 'regulated asset profile'}
			{/snippet}

			{#snippet Value()}
				{[[String((regulatedAssetProfileFields.$assetInstance.symbol) ?? ''), String((regulatedAssetProfileFields.$assetInstance.name) ?? '')].filter(Boolean).join(' ') || 'Asset instance'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

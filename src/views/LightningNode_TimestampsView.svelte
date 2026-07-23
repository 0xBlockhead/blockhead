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
		title = 'Lightning node observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LightningNode_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.LightningNode_Timestamp>
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
	entityType={EntityType.LightningNode_Timestamp}
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
				alias: true,
				timestampMs: true,
				capacitySats: true,
			},
		})
	}
	{countResource}
	getResourceItems={(lightningNodeTimestamps) => [...new Map(lightningNodeTimestamps.values.map((lightningNodeTimestamp) => [lightningNodeTimestamp[EntityMetaKey.SelectorKey], lightningNodeTimestamp])).values()]}
	getKey={(lightningNodeTimestamp) => lightningNodeTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Lightning node observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: lightningNodeTimestamp })}
		{@const lightningNodeTimestampFields = { ...lightningNodeTimestamp[EntityMetaKey.Selector], ...lightningNodeTimestamp }}
		<EntityView
			entityType={EntityType.LightningNode_Timestamp}
			entitySelector={lightningNodeTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((lightningNodeTimestampFields.alias) ?? ''), String((lightningNodeTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Lightning node timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((lightningNodeTimestampFields.capacitySats) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

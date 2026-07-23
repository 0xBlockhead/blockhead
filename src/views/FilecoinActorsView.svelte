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
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Filecoin actors',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FilecoinActors-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FilecoinActor>
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
	entityType={EntityType.FilecoinActor}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Lotus_JsonRpc,
			],
			fields: {
				address: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(filecoinActors) => [...new Map(filecoinActors.values.map((filecoinActor) => [filecoinActor[EntityMetaKey.SelectorKey], filecoinActor])).values()]}
	getKey={(filecoinActor) => filecoinActor[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Filecoin actors yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: filecoinActor })}
		{@const filecoinActorFields = { ...filecoinActor[EntityMetaKey.Selector], ...filecoinActor }}
		<EntityView
			entityType={EntityType.FilecoinActor}
			entitySelector={filecoinActor[EntityMetaKey.Selector]}
			href={
				(
					filecoinActor[EntityMetaKey.Selector] != null && 'address' in filecoinActor[EntityMetaKey.Selector]
					&& filecoinActor[EntityMetaKey.Selector].address != null
					&& filecoinActor[EntityMetaKey.Selector] != null && '$network' in filecoinActor[EntityMetaKey.Selector] ?
						filecoinActor[EntityMetaKey.Selector].$network != null && 'caip2' in filecoinActor[EntityMetaKey.Selector].$network
						&& filecoinActor[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
						address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
						network: String(caip2StringFromValue(filecoinActor[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							filecoinActor[EntityMetaKey.Selector].$network != null && 'slug' in filecoinActor[EntityMetaKey.Selector].$network
							&& filecoinActor[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
							address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
							network: String(filecoinActor[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((filecoinActorFields.address) ?? '')].filter(Boolean).join(' ') || 'filecoin actor'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

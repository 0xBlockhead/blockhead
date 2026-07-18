<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.FilecoinActor>
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
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
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
			sources: [
				Source.Lotus_JsonRpc,
			],
			fields: {
				address: true,
				$network: true,
			},
		})
	}
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
		{@const selection = select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const filecoinActorHrefFields = { ...filecoinActor, ...filecoinActor[EntityMetaKey.Selector] }}
		<FilecoinActorView
			selection={selection}
			prefetched={filecoinActorFields}
			href={
				(filecoinActorHrefFields.address !== undefined && filecoinActorHrefFields.$network !== undefined && filecoinActorHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
					address: String(filecoinActorHrefFields.address ?? ''),
					network: String(caip2StringFromValue(filecoinActorHrefFields.$network.caip2) ?? ''),
				}) : filecoinActorHrefFields.address !== undefined && filecoinActorHrefFields.$network !== undefined && filecoinActorHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
					address: String(filecoinActorHrefFields.address ?? ''),
					network: String(filecoinActorHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

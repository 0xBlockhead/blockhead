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
		title = 'Dogecoin block aux pows',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'DogecoinBlockAuxPows-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.DogecoinBlockAuxPow>
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
	import DogecoinBlockAuxPowView from '$/views/DogecoinBlockAuxPowView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DogecoinBlockAuxPow}
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
				$block: true,
				$parentBlockHeader: true,
			},
		})
	}
	getResourceItems={(dogecoinBlockAuxPows) => [...new Map(dogecoinBlockAuxPows.values.map((dogecoinBlockAuxPow) => [dogecoinBlockAuxPow[EntityMetaKey.SelectorKey], dogecoinBlockAuxPow])).values()]}
	getKey={(dogecoinBlockAuxPow) => dogecoinBlockAuxPow[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Dogecoin block aux pows yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: dogecoinBlockAuxPow })}
		{@const dogecoinBlockAuxPowFields = { ...dogecoinBlockAuxPow[EntityMetaKey.Selector], ...dogecoinBlockAuxPow }}
		{@const selection = select(EntityType.DogecoinBlockAuxPow, dogecoinBlockAuxPow[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<DogecoinBlockAuxPowView
			selection={selection}
			prefetched={dogecoinBlockAuxPowFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

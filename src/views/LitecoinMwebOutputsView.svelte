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
		title = 'Litecoin MWEB outputs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LitecoinMwebOutputs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.LitecoinMwebOutput>
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
	import LitecoinMwebOutputView from '$/views/LitecoinMwebOutputView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LitecoinMwebOutput}
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
				commitment: true,
				outputIndex: true,
				$transaction: true,
			},
		})
	}
	getResourceItems={(litecoinMwebOutputs) => [...new Map(litecoinMwebOutputs.values.map((litecoinMwebOutput) => [litecoinMwebOutput[EntityMetaKey.SelectorKey], litecoinMwebOutput])).values()]}
	getKey={(litecoinMwebOutput) => litecoinMwebOutput[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Litecoin MWEB outputs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: litecoinMwebOutput })}
		{@const litecoinMwebOutputFields = { ...litecoinMwebOutput[EntityMetaKey.Selector], ...litecoinMwebOutput }}
		{@const selection = select(EntityType.LitecoinMwebOutput, litecoinMwebOutput[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<LitecoinMwebOutputView
			selection={selection}
			prefetched={litecoinMwebOutputFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

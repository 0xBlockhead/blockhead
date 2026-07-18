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
		title = 'EIP-8004 validation observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Eip8004Validation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.Eip8004Validation_Timestamp>
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
	import Eip8004Validation_TimestampView from '$/views/Eip8004Validation_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Eip8004Validation_Timestamp}
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
				requestHash: true,
				response: true,
				validatorAddress: true,
			},
		})
	}
	getResourceItems={(eip8004ValidationTimestamps) => [...new Map(eip8004ValidationTimestamps.values.map((eip8004ValidationTimestamp) => [eip8004ValidationTimestamp[EntityMetaKey.SelectorKey], eip8004ValidationTimestamp])).values()]}
	getKey={(eip8004ValidationTimestamp) => eip8004ValidationTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EIP-8004 validation observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eip8004ValidationTimestamp })}
		{@const eip8004ValidationTimestampFields = { ...eip8004ValidationTimestamp[EntityMetaKey.Selector], ...eip8004ValidationTimestamp }}
		{@const selection = select(EntityType.Eip8004Validation_Timestamp, eip8004ValidationTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<Eip8004Validation_TimestampView
			selection={selection}
			prefetched={eip8004ValidationTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

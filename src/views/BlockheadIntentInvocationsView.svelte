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
		title = 'Blockhead intent invocations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadIntentInvocations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadIntentInvocation>
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
	import BlockheadIntentInvocationView from '$/views/BlockheadIntentInvocationView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadIntentInvocation}
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
				modality: true,
				resolvedIntentType: true,
				createdAt: true,
			},
		})
	}
	getResourceItems={(blockheadIntentInvocations) => [...new Map(blockheadIntentInvocations.values.map((blockheadIntentInvocation) => [blockheadIntentInvocation[EntityMetaKey.SelectorKey], blockheadIntentInvocation])).values()]}
	getKey={(blockheadIntentInvocation) => blockheadIntentInvocation[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead intent invocations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadIntentInvocation })}
		{@const blockheadIntentInvocationFields = { ...blockheadIntentInvocation[EntityMetaKey.Selector], ...blockheadIntentInvocation }}
		{@const selection = select(EntityType.BlockheadIntentInvocation, blockheadIntentInvocation[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadIntentInvocationView
			selection={selection}
			prefetched={blockheadIntentInvocationFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

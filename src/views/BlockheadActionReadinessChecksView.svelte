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
		title = 'Blockhead action readiness checks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadActionReadinessChecks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadActionReadinessCheck>
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
	import BlockheadActionReadinessCheckView from '$/views/BlockheadActionReadinessCheckView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadActionReadinessCheck}
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
				checkKind: true,
				capabilityKey: true,
				createdAt: true,
			},
		})
	}
	getResourceItems={(blockheadActionReadinessChecks) => [...new Map(blockheadActionReadinessChecks.values.map((blockheadActionReadinessCheck) => [blockheadActionReadinessCheck[EntityMetaKey.SelectorKey], blockheadActionReadinessCheck])).values()]}
	getKey={(blockheadActionReadinessCheck) => blockheadActionReadinessCheck[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead action readiness checks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadActionReadinessCheck })}
		{@const blockheadActionReadinessCheckFields = { ...blockheadActionReadinessCheck[EntityMetaKey.Selector], ...blockheadActionReadinessCheck }}
		{@const selection = select(EntityType.BlockheadActionReadinessCheck, blockheadActionReadinessCheck[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadActionReadinessCheckView
			selection={selection}
			prefetched={blockheadActionReadinessCheckFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

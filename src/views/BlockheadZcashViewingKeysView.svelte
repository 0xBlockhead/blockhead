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
		title = 'Blockhead Zcash viewing keys',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadZcashViewingKeys-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadZcashViewingKey>
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
	import BlockheadZcashViewingKeyView from '$/views/BlockheadZcashViewingKeyView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZcashViewingKey}
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
				keyFingerprint: true,
				keyKind: true,
				$network: true,
			},
		})
	}
	getResourceItems={(blockheadZcashViewingKeys) => [...new Map(blockheadZcashViewingKeys.values.map((blockheadZcashViewingKey) => [blockheadZcashViewingKey[EntityMetaKey.SelectorKey], blockheadZcashViewingKey])).values()]}
	getKey={(blockheadZcashViewingKey) => blockheadZcashViewingKey[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead zcash viewing keys yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadZcashViewingKey })}
		{@const blockheadZcashViewingKeyFields = { ...blockheadZcashViewingKey[EntityMetaKey.Selector], ...blockheadZcashViewingKey }}
		{@const selection = select(EntityType.BlockheadZcashViewingKey, blockheadZcashViewingKey[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadZcashViewingKeyView
			selection={selection}
			prefetched={blockheadZcashViewingKeyFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

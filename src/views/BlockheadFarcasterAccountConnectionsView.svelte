<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Blockhead Farcaster account connections',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadFarcasterAccountConnections-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadFarcasterAccountConnection>
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
	import BlockheadFarcasterAccountConnectionView from '$/views/BlockheadFarcasterAccountConnectionView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadFarcasterAccountConnection}
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
				$user: true,
				authMethod: true,
				connectionId: true,
			},
		})
	}
	getResourceItems={(blockheadFarcasterAccountConnections) => [...new Map(blockheadFarcasterAccountConnections.values.map((blockheadFarcasterAccountConnection) => [blockheadFarcasterAccountConnection[EntityMetaKey.SelectorKey], blockheadFarcasterAccountConnection])).values()]}
	getKey={(blockheadFarcasterAccountConnection) => blockheadFarcasterAccountConnection[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Farcaster account connections yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadFarcasterAccountConnection })}
		{@const blockheadFarcasterAccountConnectionFields = { ...blockheadFarcasterAccountConnection[EntityMetaKey.Selector], ...blockheadFarcasterAccountConnection }}
		{@const selection = select(EntityType.BlockheadFarcasterAccountConnection, blockheadFarcasterAccountConnection[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const blockheadFarcasterAccountConnectionHrefFields = { ...blockheadFarcasterAccountConnection, ...blockheadFarcasterAccountConnection[EntityMetaKey.Selector] }}
		<BlockheadFarcasterAccountConnectionView
			selection={selection}
			prefetched={blockheadFarcasterAccountConnectionFields}
			href={
				(blockheadFarcasterAccountConnectionHrefFields.connectionId !== undefined ? resolve('/farcaster/account/[connectionId=stringSegment]', {
					connectionId: String(blockheadFarcasterAccountConnectionHrefFields.connectionId ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

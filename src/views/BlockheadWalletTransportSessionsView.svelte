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
		title = 'Wallet transport sessions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadWalletTransportSessions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadWalletTransportSession>
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
	import BlockheadWalletTransportSessionView from '$/views/BlockheadWalletTransportSessionView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWalletTransportSession}
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
				transportSessionId: true,
				status: true,
				transportKind: true,
			},
		})
	}
	getResourceItems={(blockheadWalletTransportSessions) => [...new Map(blockheadWalletTransportSessions.values.map((blockheadWalletTransportSession) => [blockheadWalletTransportSession[EntityMetaKey.SelectorKey], blockheadWalletTransportSession])).values()]}
	getKey={(blockheadWalletTransportSession) => blockheadWalletTransportSession[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead wallet transport sessions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadWalletTransportSession })}
		{@const blockheadWalletTransportSessionFields = { ...blockheadWalletTransportSession[EntityMetaKey.Selector], ...blockheadWalletTransportSession }}
		{@const selection = select(EntityType.BlockheadWalletTransportSession, blockheadWalletTransportSession[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadWalletTransportSessionView
			selection={selection}
			prefetched={blockheadWalletTransportSessionFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

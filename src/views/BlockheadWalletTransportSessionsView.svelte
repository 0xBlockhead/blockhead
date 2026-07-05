<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Wallet transport sessions',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadWalletTransportSessions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadWalletTransportSession>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadWalletTransportSessionView from '$/views/BlockheadWalletTransportSessionView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					transportSessionId: true,
					status: true,
					transportKind: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(blockheadWalletTransportSessions)}
			{@const uniqueBlockheadWalletTransportSessions = [...new Map(blockheadWalletTransportSessions.values.map((blockheadWalletTransportSession) => [blockheadWalletTransportSession[EntityMetaKey.SelectorKey], blockheadWalletTransportSession])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadWalletTransportSession}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadWalletTransportSessions.totalCount}
				getKey={(blockheadWalletTransportSession) => blockheadWalletTransportSession[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadWalletTransportSessions}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead wallet transport sessions yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadWalletTransportSession }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadWalletTransportSession> })}
					{@const blockheadWalletTransportSessionFields = { ...blockheadWalletTransportSession[EntityMetaKey.Selector], ...blockheadWalletTransportSession }}
					<BlockheadWalletTransportSessionView
						selection={select(EntityType.BlockheadWalletTransportSession, blockheadWalletTransportSession[EntityMetaKey.Selector])}
						prefetched={blockheadWalletTransportSessionFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.BlockheadWalletTransportSession}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

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
		title = 'Wallet connections',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadWalletConnections-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadWalletConnection>
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
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
					$wallet: true,
					status: true,
					connectionKey: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadWalletConnection}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadWalletConnections)}
			{@const uniqueBlockheadWalletConnections = [...new Map(blockheadWalletConnections.values.map((blockheadWalletConnection) => [blockheadWalletConnection[EntityMetaKey.SelectorKey], blockheadWalletConnection])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadWalletConnection}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadWalletConnections.totalCount}
				getKey={(blockheadWalletConnection) => blockheadWalletConnection[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadWalletConnections}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Wallet connections yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadWalletConnection })}
					{@const blockheadWalletConnectionFields = { ...blockheadWalletConnection[EntityMetaKey.Selector], ...blockheadWalletConnection }}
					{@const selection = select(EntityType.BlockheadWalletConnection, blockheadWalletConnection[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const blockheadWalletConnectionHrefFields = { ...blockheadWalletConnection, ...blockheadWalletConnection[EntityMetaKey.Selector] }}
					<BlockheadWalletConnectionView
						selection={selection}
						prefetched={blockheadWalletConnectionFields}
						href={
							(blockheadWalletConnectionHrefFields.connectionKey !== undefined ? resolve('/~/accounts/connections/[connectionKey=stringSegment]', {
								connectionKey: String(blockheadWalletConnectionHrefFields.connectionKey ?? ''),
							}) : undefined)
						}
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
		entityType={EntityType.BlockheadWalletConnection}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

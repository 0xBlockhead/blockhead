<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Extrinsics',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Polkadot extrinsics...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotExtrinsics-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.PolkadotExtrinsic>
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
	import PolkadotExtrinsicView from '$/views/PolkadotExtrinsicView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					indexInBlock: true,
					callName: true,
					success: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotExtrinsic}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(polkadotExtrinsics)}
			{@const uniquePolkadotExtrinsics = [...new Map(polkadotExtrinsics.values.map((polkadotExtrinsic) => [polkadotExtrinsic[EntityMetaKey.SelectorKey], polkadotExtrinsic])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotExtrinsic}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={polkadotExtrinsics.values.length === uniquePolkadotExtrinsics.length && polkadotExtrinsics.totalCount != null && polkadotExtrinsics.totalCount >= uniquePolkadotExtrinsics.length ? polkadotExtrinsics.totalCount : uniquePolkadotExtrinsics.length}
				getKey={(polkadotExtrinsic) => polkadotExtrinsic[EntityMetaKey.SelectorKey]}
				items={uniquePolkadotExtrinsics}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Polkadot extrinsics yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: polkadotExtrinsic }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.PolkadotExtrinsic> })}
					<PolkadotExtrinsicView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
								networkSlug: String(networkByCaip2[String(({ ...polkadotExtrinsic.entitySelector, ...polkadotExtrinsic }).$block.$network.caip2)].slug),
								blockNumber: String(({ ...polkadotExtrinsic.entitySelector, ...polkadotExtrinsic }).$block.blockNumber),
								hash: String(({ ...polkadotExtrinsic.entitySelector, ...polkadotExtrinsic }).$block.hash),
								extrinsicIndex: String(({ ...polkadotExtrinsic.entitySelector, ...polkadotExtrinsic }).indexInBlock),
							})
						}
						selection={select(EntityType.PolkadotExtrinsic, polkadotExtrinsic.entitySelector)}
						prefetched={polkadotExtrinsic}
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
		entityType={EntityType.PolkadotExtrinsic}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

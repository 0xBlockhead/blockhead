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
		placeholderText,
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
			selection({
				fields: {
					indexInBlock: true,
					callName: true,
					success: true,
					$block: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={polkadotExtrinsics.totalCount}
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
					{@const polkadotExtrinsicFields = { ...polkadotExtrinsic[EntityMetaKey.Selector], ...polkadotExtrinsic }}
					{@const polkadotExtrinsicHrefFields = { ...polkadotExtrinsic, ...polkadotExtrinsic[EntityMetaKey.Selector] }}
					<PolkadotExtrinsicView
						selection={select(EntityType.PolkadotExtrinsic, polkadotExtrinsic[EntityMetaKey.Selector])}
						prefetched={polkadotExtrinsicFields}
						href={
							(polkadotExtrinsicHrefFields.$block !== undefined && polkadotExtrinsicHrefFields.$block.$network !== undefined && polkadotExtrinsicHrefFields.$block.$network.caip2 !== undefined && polkadotExtrinsicHrefFields.$block.$network.caip2.namespace !== undefined && polkadotExtrinsicHrefFields.$block !== undefined && polkadotExtrinsicHrefFields.$block.$network !== undefined && polkadotExtrinsicHrefFields.$block.$network.caip2 !== undefined && polkadotExtrinsicHrefFields.$block.$network.caip2.reference !== undefined && polkadotExtrinsicHrefFields.$block !== undefined && polkadotExtrinsicHrefFields.$block.blockNumber !== undefined && polkadotExtrinsicHrefFields.$block !== undefined && polkadotExtrinsicHrefFields.$block.hash !== undefined && polkadotExtrinsicHrefFields.indexInBlock !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
								networkSlug: String(networkByCaip2[String(String(polkadotExtrinsicHrefFields.$block.$network.caip2.namespace) + ':' + String(polkadotExtrinsicHrefFields.$block.$network.caip2.reference))].slug ?? ''),
								blockNumber: String(polkadotExtrinsicHrefFields.$block.blockNumber ?? ''),
								hash: String(polkadotExtrinsicHrefFields.$block.hash ?? ''),
								extrinsicIndex: String(polkadotExtrinsicHrefFields.indexInBlock ?? ''),
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
		entityType={EntityType.PolkadotExtrinsic}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

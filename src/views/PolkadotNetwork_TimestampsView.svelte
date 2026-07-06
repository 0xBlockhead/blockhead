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
		title = 'Runtime snapshots',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.PolkadotNetwork_Timestamp>
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
	import PolkadotNetwork_TimestampView from '$/views/PolkadotNetwork_TimestampView.svelte'
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
					runtimeSpecName: true,
					source: true,
					finalizedBlockNumber: true,
					isSyncing: true,
					peerCount: true,
					$network: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(polkadotNetworkTimestamps)}
			{@const uniquePolkadotNetworkTimestamps = [...new Map(polkadotNetworkTimestamps.values.map((polkadotNetworkTimestamp) => [polkadotNetworkTimestamp[EntityMetaKey.SelectorKey], polkadotNetworkTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={polkadotNetworkTimestamps.totalCount}
				getKey={(polkadotNetworkTimestamp) => polkadotNetworkTimestamp[EntityMetaKey.SelectorKey]}
				items={uniquePolkadotNetworkTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Polkadot network observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: polkadotNetworkTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.PolkadotNetwork_Timestamp> })}
					{@const polkadotNetworkTimestampFields = { ...polkadotNetworkTimestamp[EntityMetaKey.Selector], ...polkadotNetworkTimestamp }}
					{@const polkadotNetworkTimestampHrefFields = { ...polkadotNetworkTimestamp, ...polkadotNetworkTimestamp[EntityMetaKey.Selector] }}
					<PolkadotNetwork_TimestampView
						selection={select(EntityType.PolkadotNetwork_Timestamp, polkadotNetworkTimestamp[EntityMetaKey.Selector])}
						prefetched={polkadotNetworkTimestampFields}
						href={
							(polkadotNetworkTimestampHrefFields.$network !== undefined && polkadotNetworkTimestampHrefFields.$network.caip2 !== undefined && polkadotNetworkTimestampHrefFields.$network.caip2.namespace !== undefined && polkadotNetworkTimestampHrefFields.$network !== undefined && polkadotNetworkTimestampHrefFields.$network.caip2 !== undefined && polkadotNetworkTimestampHrefFields.$network.caip2.reference !== undefined && polkadotNetworkTimestampHrefFields.timestampMs !== undefined && polkadotNetworkTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/observation/[timestampMs=nonNegativeInteger]/[source]', {
								networkSlug: String(networkByCaip2[String(String(polkadotNetworkTimestampHrefFields.$network.caip2.namespace) + ':' + String(polkadotNetworkTimestampHrefFields.$network.caip2.reference))].slug ?? ''),
								timestampMs: String(polkadotNetworkTimestampHrefFields.timestampMs ?? ''),
								source: String(polkadotNetworkTimestampHrefFields.source ?? ''),
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
		entityType={EntityType.PolkadotNetwork_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

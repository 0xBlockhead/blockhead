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
		title = 'Network snapshots',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SolanaNetwork_Timestamp>
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
	import SolanaNetwork_TimestampView from '$/views/SolanaNetwork_TimestampView.svelte'
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
					source: true,
					absoluteSlot: true,
					blockHeight: true,
					health: true,
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
				entityType={EntityType.SolanaNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(solanaNetworkTimestamps)}
			{@const uniqueSolanaNetworkTimestamps = [...new Map(solanaNetworkTimestamps.values.map((solanaNetworkTimestamp) => [solanaNetworkTimestamp[EntityMetaKey.SelectorKey], solanaNetworkTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={solanaNetworkTimestamps.totalCount}
				getKey={(solanaNetworkTimestamp) => solanaNetworkTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueSolanaNetworkTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Solana network observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: solanaNetworkTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SolanaNetwork_Timestamp> })}
					{@const solanaNetworkTimestampFields = { ...solanaNetworkTimestamp[EntityMetaKey.Selector], ...solanaNetworkTimestamp }}
					{@const solanaNetworkTimestampHrefFields = { ...solanaNetworkTimestamp, ...solanaNetworkTimestamp[EntityMetaKey.Selector] }}
					<SolanaNetwork_TimestampView
						selection={select(EntityType.SolanaNetwork_Timestamp, solanaNetworkTimestamp[EntityMetaKey.Selector])}
						prefetched={solanaNetworkTimestampFields}
						href={
							(solanaNetworkTimestampHrefFields.$network !== undefined && solanaNetworkTimestampHrefFields.$network.caip2 !== undefined && solanaNetworkTimestampHrefFields.$network.caip2.namespace !== undefined && solanaNetworkTimestampHrefFields.$network !== undefined && solanaNetworkTimestampHrefFields.$network.caip2 !== undefined && solanaNetworkTimestampHrefFields.$network.caip2.reference !== undefined && solanaNetworkTimestampHrefFields.timestampMs !== undefined && solanaNetworkTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/observations/[timestampMs=nonNegativeInteger]/[source]', {
								networkSlug: String(networkByCaip2[String(String(solanaNetworkTimestampHrefFields.$network.caip2.namespace) + ':' + String(solanaNetworkTimestampHrefFields.$network.caip2.reference))].slug ?? ''),
								timestampMs: String(solanaNetworkTimestampHrefFields.timestampMs ?? ''),
								source: String(solanaNetworkTimestampHrefFields.source ?? ''),
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
		entityType={EntityType.SolanaNetwork_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

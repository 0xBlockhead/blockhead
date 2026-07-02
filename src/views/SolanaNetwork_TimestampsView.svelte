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


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Network snapshots',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Solana network observations...',
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
			selection.sources == null ? selection({
				fields: {
					source: true,
					absoluteSlot: true,
					blockHeight: true,
					health: true,
				},
			}) : selection
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
				totalCount={solanaNetworkTimestamps.values.length === uniqueSolanaNetworkTimestamps.length && solanaNetworkTimestamps.totalCount != null && solanaNetworkTimestamps.totalCount >= uniqueSolanaNetworkTimestamps.length ? solanaNetworkTimestamps.totalCount : uniqueSolanaNetworkTimestamps.length}
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
					<SolanaNetwork_TimestampView
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/observations/[timestampMs=nonNegativeInteger]/[source]', {
								networkSlug: String(({ ...solanaNetworkTimestamp.entitySelector, ...solanaNetworkTimestamp }).$network.slug),
								timestampMs: String(({ ...solanaNetworkTimestamp.entitySelector, ...solanaNetworkTimestamp }).timestampMs),
								source: String(({ ...solanaNetworkTimestamp.entitySelector, ...solanaNetworkTimestamp }).source),
							})
						}
						selection={select(EntityType.SolanaNetwork_Timestamp, solanaNetworkTimestamp.entitySelector)}
						prefetched={solanaNetworkTimestamp}
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

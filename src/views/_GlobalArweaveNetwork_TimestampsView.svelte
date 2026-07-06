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
		title = 'Arweave hub observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalArweaveNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType._GlobalArweaveNetwork_Timestamp>
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
	import GlobalArweaveNetwork_TimestampView from '$/views/_GlobalArweaveNetwork_TimestampView.svelte'
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
					timestampMs: true,
					sourceReportedLatestHeight: true,
					reachable: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalArweaveNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(globalArweaveNetworkTimestamps)}
			{@const uniqueGlobalArweaveNetworkTimestamps = [...new Map(globalArweaveNetworkTimestamps.values.map((globalArweaveNetworkTimestamp) => [globalArweaveNetworkTimestamp[EntityMetaKey.SelectorKey], globalArweaveNetworkTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalArweaveNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={globalArweaveNetworkTimestamps.totalCount}
				getKey={(globalArweaveNetworkTimestamp) => globalArweaveNetworkTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueGlobalArweaveNetworkTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Global Arweave network observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: globalArweaveNetworkTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType._GlobalArweaveNetwork_Timestamp> })}
					{@const globalArweaveNetworkTimestampFields = { ...globalArweaveNetworkTimestamp[EntityMetaKey.Selector], ...globalArweaveNetworkTimestamp }}
					<GlobalArweaveNetwork_TimestampView
						selection={select(EntityType._GlobalArweaveNetwork_Timestamp, globalArweaveNetworkTimestamp[EntityMetaKey.Selector])}
						prefetched={globalArweaveNetworkTimestampFields}
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
		entityType={EntityType._GlobalArweaveNetwork_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

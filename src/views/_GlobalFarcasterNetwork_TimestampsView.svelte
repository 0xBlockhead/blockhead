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
		title = 'Global Farcaster network observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalFarcasterNetwork_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType._GlobalFarcasterNetwork_Timestamp>
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
	import GlobalFarcasterNetwork_TimestampView from '$/views/_GlobalFarcasterNetwork_TimestampView.svelte'
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
					$hub: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(globalFarcasterNetworkTimestamps)}
			{@const uniqueGlobalFarcasterNetworkTimestamps = [...new Map(globalFarcasterNetworkTimestamps.values.map((globalFarcasterNetworkTimestamp) => [globalFarcasterNetworkTimestamp[EntityMetaKey.SelectorKey], globalFarcasterNetworkTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalFarcasterNetwork_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={globalFarcasterNetworkTimestamps.totalCount}
				getKey={(globalFarcasterNetworkTimestamp) => globalFarcasterNetworkTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueGlobalFarcasterNetworkTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Global Farcaster network observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: globalFarcasterNetworkTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType._GlobalFarcasterNetwork_Timestamp> })}
					{@const globalFarcasterNetworkTimestampFields = { ...globalFarcasterNetworkTimestamp[EntityMetaKey.Selector], ...globalFarcasterNetworkTimestamp }}
					<GlobalFarcasterNetwork_TimestampView
						selection={select(EntityType._GlobalFarcasterNetwork_Timestamp, globalFarcasterNetworkTimestamp[EntityMetaKey.Selector])}
						prefetched={globalFarcasterNetworkTimestampFields}
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
		entityType={EntityType._GlobalFarcasterNetwork_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

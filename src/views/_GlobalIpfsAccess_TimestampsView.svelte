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
		title = 'Global IPFS access observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Global IPFS access observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalIpfsAccess_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType._GlobalIpfsAccess_Timestamp>
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
	import GlobalIpfsAccess_TimestampView from '$/views/_GlobalIpfsAccess_TimestampView.svelte'
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
					$hub: true,
					timestampMs: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalIpfsAccess_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(globalIpfsAccessTimestamps)}
			{@const uniqueGlobalIpfsAccessTimestamps = [...new Map(globalIpfsAccessTimestamps.values.map((globalIpfsAccessTimestamp) => [globalIpfsAccessTimestamp[EntityMetaKey.SelectorKey], globalIpfsAccessTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType._GlobalIpfsAccess_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={globalIpfsAccessTimestamps.values.length === uniqueGlobalIpfsAccessTimestamps.length && globalIpfsAccessTimestamps.totalCount != null && globalIpfsAccessTimestamps.totalCount >= uniqueGlobalIpfsAccessTimestamps.length ? globalIpfsAccessTimestamps.totalCount : uniqueGlobalIpfsAccessTimestamps.length}
				getKey={(globalIpfsAccessTimestamp) => globalIpfsAccessTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueGlobalIpfsAccessTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No global IPFS access observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: globalIpfsAccessTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType._GlobalIpfsAccess_Timestamp> })}
					<GlobalIpfsAccess_TimestampView
						href={
							resolve('/(explore)/(ipfs)/ipfs/access/observations/[timestampMs=nonNegativeInteger]/[source]', {
								timestampMs: String(globalIpfsAccessTimestamp.entitySelector.timestampMs),
								source: String(globalIpfsAccessTimestamp.entitySelector.source),
							})
						}
						selection={select(EntityType._GlobalIpfsAccess_Timestamp, globalIpfsAccessTimestamp.entitySelector)}
						prefetched={globalIpfsAccessTimestamp}
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
		entityType={EntityType._GlobalIpfsAccess_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

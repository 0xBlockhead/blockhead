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
		placeholderText,
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
			selection({
				fields: {
					$hub: true,
					timestampMs: true,
					source: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={globalIpfsAccessTimestamps.totalCount}
				getKey={(globalIpfsAccessTimestamp) => globalIpfsAccessTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueGlobalIpfsAccessTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Global IPFS access observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: globalIpfsAccessTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType._GlobalIpfsAccess_Timestamp> })}
					{@const globalIpfsAccessTimestampFields = { ...globalIpfsAccessTimestamp[EntityMetaKey.Selector], ...globalIpfsAccessTimestamp }}
					{@const globalIpfsAccessTimestampHrefFields = { ...globalIpfsAccessTimestamp, ...globalIpfsAccessTimestamp[EntityMetaKey.Selector] }}
					<GlobalIpfsAccess_TimestampView
						selection={select(EntityType._GlobalIpfsAccess_Timestamp, globalIpfsAccessTimestamp[EntityMetaKey.Selector])}
						prefetched={globalIpfsAccessTimestampFields}
						href={
							(globalIpfsAccessTimestampHrefFields.timestampMs !== undefined && globalIpfsAccessTimestampHrefFields.source !== undefined ? resolve('/(explore)/(ipfs)/ipfs/access/observations/[timestampMs=nonNegativeInteger]/[source]', {
								timestampMs: String(globalIpfsAccessTimestampHrefFields.timestampMs ?? ''),
								source: String(globalIpfsAccessTimestampHrefFields.source ?? ''),
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
		entityType={EntityType._GlobalIpfsAccess_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

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
		title = 'MEV builder observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MevBuilder_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.MevBuilder_Timestamp>
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
	import MevBuilder_TimestampView from '$/views/MevBuilder_TimestampView.svelte'
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
					deliveredPayloadCount: true,
					deliveredValueWei: true,
					$builder: true,
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
				entityType={EntityType.MevBuilder_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(mevBuilderTimestamps)}
			{@const uniqueMevBuilderTimestamps = [...new Map(mevBuilderTimestamps.values.map((mevBuilderTimestamp) => [mevBuilderTimestamp[EntityMetaKey.SelectorKey], mevBuilderTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.MevBuilder_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={mevBuilderTimestamps.totalCount}
				getKey={(mevBuilderTimestamp) => mevBuilderTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueMevBuilderTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No MEV builder observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: mevBuilderTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.MevBuilder_Timestamp> })}
					{@const mevBuilderTimestampFields = { ...mevBuilderTimestamp[EntityMetaKey.Selector], ...mevBuilderTimestamp }}
					{@const mevBuilderTimestampHrefFields = { ...mevBuilderTimestamp, ...mevBuilderTimestamp[EntityMetaKey.Selector] }}
					<MevBuilder_TimestampView
						selection={select(EntityType.MevBuilder_Timestamp, mevBuilderTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={mevBuilderTimestampFields}
						href={
							(mevBuilderTimestampHrefFields.$builder !== undefined && mevBuilderTimestampHrefFields.$builder.$network !== undefined && mevBuilderTimestampHrefFields.$builder.$network.slug !== undefined && mevBuilderTimestampHrefFields.$builder.builderPubkey !== undefined && mevBuilderTimestampHrefFields.timestampMs !== undefined && mevBuilderTimestampHrefFields.source !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								network: String(mevBuilderTimestampHrefFields.$builder.$network.slug ?? ''),
								builderPubkey: String(mevBuilderTimestampHrefFields.$builder.builderPubkey ?? ''),
								timestampMs: String(mevBuilderTimestampHrefFields.timestampMs ?? ''),
								source: String(mevBuilderTimestampHrefFields.source ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.MevBuilder_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'MEV builder observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MevBuilder_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.MevBuilder_Timestamp>
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

	const collectionSelection = $derived(selection)


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

				{#snippet Item({ item: mevBuilderTimestamp })}
					{@const mevBuilderTimestampFields = { ...mevBuilderTimestamp[EntityMetaKey.Selector], ...mevBuilderTimestamp }}
					{@const selection = select(EntityType.MevBuilder_Timestamp, mevBuilderTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const mevBuilderTimestampHrefFields = { ...mevBuilderTimestamp, ...mevBuilderTimestamp[EntityMetaKey.Selector] }}
					<MevBuilder_TimestampView
						selection={selection}
						prefetched={mevBuilderTimestampFields}
						href={
							(mevBuilderTimestampHrefFields.timestampMs !== undefined && mevBuilderTimestampHrefFields.source !== undefined && mevBuilderTimestampHrefFields.$builder !== undefined && mevBuilderTimestampHrefFields.$builder.builderPubkey !== undefined && mevBuilderTimestampHrefFields.$builder.$network !== undefined && mevBuilderTimestampHrefFields.$builder.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								timestampMs: String(mevBuilderTimestampHrefFields.timestampMs ?? ''),
								source: String(mevBuilderTimestampHrefFields.source ?? ''),
								builderPubkey: String(mevBuilderTimestampHrefFields.$builder.builderPubkey ?? ''),
								network: String(caip2StringFromValue(mevBuilderTimestampHrefFields.$builder.$network.caip2) ?? ''),
							}) : mevBuilderTimestampHrefFields.timestampMs !== undefined && mevBuilderTimestampHrefFields.source !== undefined && mevBuilderTimestampHrefFields.$builder !== undefined && mevBuilderTimestampHrefFields.$builder.builderPubkey !== undefined && mevBuilderTimestampHrefFields.$builder.$network !== undefined && mevBuilderTimestampHrefFields.$builder.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								timestampMs: String(mevBuilderTimestampHrefFields.timestampMs ?? ''),
								source: String(mevBuilderTimestampHrefFields.source ?? ''),
								builderPubkey: String(mevBuilderTimestampHrefFields.$builder.builderPubkey ?? ''),
								network: String(mevBuilderTimestampHrefFields.$builder.$network.slug ?? ''),
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

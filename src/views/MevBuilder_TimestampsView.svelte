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
		placeholderText = 'Loading MEV builder observations...',
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
			selection.sources == null ? selection({
				fields: {
					deliveredPayloadCount: true,
					deliveredValueWei: true,
					$builder: true,
				},
			}) : selection
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
				totalCount={mevBuilderTimestamps.values.length === uniqueMevBuilderTimestamps.length && mevBuilderTimestamps.totalCount != null && mevBuilderTimestamps.totalCount >= uniqueMevBuilderTimestamps.length ? mevBuilderTimestamps.totalCount : uniqueMevBuilderTimestamps.length}
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
					<MevBuilder_TimestampView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builder/[builderPubkey]/timestamp/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(({ ...mevBuilderTimestamp.entitySelector, ...mevBuilderTimestamp }).$builder.$network.caip2.namespace)}:${String(({ ...mevBuilderTimestamp.entitySelector, ...mevBuilderTimestamp }).$builder.$network.caip2.reference)}`,
								builderPubkey: String(({ ...mevBuilderTimestamp.entitySelector, ...mevBuilderTimestamp }).$builder.builderPubkey),
								timestampMs: String(({ ...mevBuilderTimestamp.entitySelector, ...mevBuilderTimestamp }).timestampMs),
								source: String(({ ...mevBuilderTimestamp.entitySelector, ...mevBuilderTimestamp }).source),
							})
						}
						selection={select(EntityType.MevBuilder_Timestamp, mevBuilderTimestamp.entitySelector)}
						prefetched={mevBuilderTimestamp}
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
		entityType={EntityType.MevBuilder_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

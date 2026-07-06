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
		title = 'CCTP fast burn allowance observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CctpFastBurnAllowance_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CctpFastBurnAllowance_Timestamp>
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
	import CctpFastBurnAllowance_TimestampView from '$/views/CctpFastBurnAllowance_TimestampView.svelte'
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
					allowanceUsdc: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CctpFastBurnAllowance_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(cctpFastBurnAllowanceTimestamps)}
			{@const uniqueCctpFastBurnAllowanceTimestamps = [...new Map(cctpFastBurnAllowanceTimestamps.values.map((cctpFastBurnAllowanceTimestamp) => [cctpFastBurnAllowanceTimestamp[EntityMetaKey.SelectorKey], cctpFastBurnAllowanceTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CctpFastBurnAllowance_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cctpFastBurnAllowanceTimestamps.totalCount}
				getKey={(cctpFastBurnAllowanceTimestamp) => cctpFastBurnAllowanceTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueCctpFastBurnAllowanceTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No CCTP fast burn allowance observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cctpFastBurnAllowanceTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CctpFastBurnAllowance_Timestamp> })}
					{@const cctpFastBurnAllowanceTimestampFields = { ...cctpFastBurnAllowanceTimestamp[EntityMetaKey.Selector], ...cctpFastBurnAllowanceTimestamp }}
					<CctpFastBurnAllowance_TimestampView
						selection={select(EntityType.CctpFastBurnAllowance_Timestamp, cctpFastBurnAllowanceTimestamp[EntityMetaKey.Selector])}
						prefetched={cctpFastBurnAllowanceTimestampFields}
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
		entityType={EntityType.CctpFastBurnAllowance_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

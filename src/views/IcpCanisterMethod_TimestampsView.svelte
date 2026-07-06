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
		title = 'ICP canister method observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'IcpCanisterMethod_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.IcpCanisterMethod_Timestamp>
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
	import IcpCanisterMethod_TimestampView from '$/views/IcpCanisterMethod_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={selection}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.IcpCanisterMethod_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(icpCanisterMethodTimestamps)}
			{@const uniqueIcpCanisterMethodTimestamps = [...new Map(icpCanisterMethodTimestamps.values.map((icpCanisterMethodTimestamp) => [icpCanisterMethodTimestamp[EntityMetaKey.SelectorKey], icpCanisterMethodTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.IcpCanisterMethod_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={icpCanisterMethodTimestamps.totalCount}
				getKey={(icpCanisterMethodTimestamp) => icpCanisterMethodTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueIcpCanisterMethodTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ICP canister method observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: icpCanisterMethodTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.IcpCanisterMethod_Timestamp> })}
					{@const icpCanisterMethodTimestampFields = { ...icpCanisterMethodTimestamp[EntityMetaKey.Selector], ...icpCanisterMethodTimestamp }}
					<IcpCanisterMethod_TimestampView
						selection={select(EntityType.IcpCanisterMethod_Timestamp, icpCanisterMethodTimestamp[EntityMetaKey.Selector])}
						prefetched={icpCanisterMethodTimestampFields}
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
		entityType={EntityType.IcpCanisterMethod_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

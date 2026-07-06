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
		title = 'Payjoin endpoint observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PayjoinEndpoint_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.PayjoinEndpoint_Timestamp>
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
	import PayjoinEndpoint_TimestampView from '$/views/PayjoinEndpoint_TimestampView.svelte'
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
					responseStatus: true,
					error: true,
					requiresOhttp: true,
					supportsOutputSubstitution: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PayjoinEndpoint_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(payjoinEndpointTimestamps)}
			{@const uniquePayjoinEndpointTimestamps = [...new Map(payjoinEndpointTimestamps.values.map((payjoinEndpointTimestamp) => [payjoinEndpointTimestamp[EntityMetaKey.SelectorKey], payjoinEndpointTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PayjoinEndpoint_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={payjoinEndpointTimestamps.totalCount}
				getKey={(payjoinEndpointTimestamp) => payjoinEndpointTimestamp[EntityMetaKey.SelectorKey]}
				items={uniquePayjoinEndpointTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Payjoin endpoint observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: payjoinEndpointTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.PayjoinEndpoint_Timestamp> })}
					{@const payjoinEndpointTimestampFields = { ...payjoinEndpointTimestamp[EntityMetaKey.Selector], ...payjoinEndpointTimestamp }}
					<PayjoinEndpoint_TimestampView
						selection={select(EntityType.PayjoinEndpoint_Timestamp, payjoinEndpointTimestamp[EntityMetaKey.Selector])}
						prefetched={payjoinEndpointTimestampFields}
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
		entityType={EntityType.PayjoinEndpoint_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

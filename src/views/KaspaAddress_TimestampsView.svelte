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
		title = 'Kaspa address observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'KaspaAddress_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.KaspaAddress_Timestamp>
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
	import KaspaAddress_TimestampView from '$/views/KaspaAddress_TimestampView.svelte'
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
		{#snippet children(kaspaAddressTimestamps)}
			{@const uniqueKaspaAddressTimestamps = [...new Map(kaspaAddressTimestamps.values.map((kaspaAddressTimestamp) => [kaspaAddressTimestamp[EntityMetaKey.SelectorKey], kaspaAddressTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.KaspaAddress_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={kaspaAddressTimestamps.totalCount}
				getKey={(kaspaAddressTimestamp) => kaspaAddressTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueKaspaAddressTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Kaspa address observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: kaspaAddressTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.KaspaAddress_Timestamp> })}
					{@const kaspaAddressTimestampFields = { ...kaspaAddressTimestamp[EntityMetaKey.Selector], ...kaspaAddressTimestamp }}
					<KaspaAddress_TimestampView
						selection={select(EntityType.KaspaAddress_Timestamp, kaspaAddressTimestamp[EntityMetaKey.Selector])}
						prefetched={kaspaAddressTimestampFields}
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
		entityType={EntityType.KaspaAddress_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

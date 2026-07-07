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
		title = 'Lens account observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LensAccount_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.LensAccount_Timestamp>
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
	import LensAccount_TimestampView from '$/views/LensAccount_TimestampView.svelte'
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
					$account: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LensAccount_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(lensAccountTimestamps)}
			{@const uniqueLensAccountTimestamps = [...new Map(lensAccountTimestamps.values.map((lensAccountTimestamp) => [lensAccountTimestamp[EntityMetaKey.SelectorKey], lensAccountTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LensAccount_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={lensAccountTimestamps.totalCount}
				getKey={(lensAccountTimestamp) => lensAccountTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueLensAccountTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Lens account observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: lensAccountTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.LensAccount_Timestamp> })}
					{@const lensAccountTimestampFields = { ...lensAccountTimestamp[EntityMetaKey.Selector], ...lensAccountTimestamp }}
					{@const lensAccountTimestampHrefFields = { ...lensAccountTimestamp, ...lensAccountTimestamp[EntityMetaKey.Selector] }}
					<LensAccount_TimestampView
						selection={select(EntityType.LensAccount_Timestamp, lensAccountTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={lensAccountTimestampFields}
						href={
							(lensAccountTimestampHrefFields.$account !== undefined && lensAccountTimestampHrefFields.$account.address !== undefined && lensAccountTimestampHrefFields.timestampMs !== undefined ? resolve('/(social)/(lens)/lens/account/[address=evmAddress]/(account)/observations/[timestampMs=nonNegativeInteger]', {
								address: String(lensAccountTimestampHrefFields.$account.address ?? ''),
								timestampMs: String(lensAccountTimestampHrefFields.timestampMs ?? ''),
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
		entityType={EntityType.LensAccount_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

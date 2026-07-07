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
		title = 'Stellar account signer observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'StellarAccountSigner_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.StellarAccountSigner_Timestamp>
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
	import StellarAccountSigner_TimestampView from '$/views/StellarAccountSigner_TimestampView.svelte'
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
				entityType={EntityType.StellarAccountSigner_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(stellarAccountSignerTimestamps)}
			{@const uniqueStellarAccountSignerTimestamps = [...new Map(stellarAccountSignerTimestamps.values.map((stellarAccountSignerTimestamp) => [stellarAccountSignerTimestamp[EntityMetaKey.SelectorKey], stellarAccountSignerTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.StellarAccountSigner_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={stellarAccountSignerTimestamps.totalCount}
				getKey={(stellarAccountSignerTimestamp) => stellarAccountSignerTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueStellarAccountSignerTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Stellar account signer observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: stellarAccountSignerTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.StellarAccountSigner_Timestamp> })}
					{@const stellarAccountSignerTimestampFields = { ...stellarAccountSignerTimestamp[EntityMetaKey.Selector], ...stellarAccountSignerTimestamp }}
					<StellarAccountSigner_TimestampView
						selection={select(EntityType.StellarAccountSigner_Timestamp, stellarAccountSignerTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={stellarAccountSignerTimestampFields}
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
		entityType={EntityType.StellarAccountSigner_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

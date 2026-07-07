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
		title = 'ICP ledger canister observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'IcpLedgerCanister_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.IcpLedgerCanister_Timestamp>
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
	import IcpLedgerCanister_TimestampView from '$/views/IcpLedgerCanister_TimestampView.svelte'
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
				entityType={EntityType.IcpLedgerCanister_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(icpLedgerCanisterTimestamps)}
			{@const uniqueIcpLedgerCanisterTimestamps = [...new Map(icpLedgerCanisterTimestamps.values.map((icpLedgerCanisterTimestamp) => [icpLedgerCanisterTimestamp[EntityMetaKey.SelectorKey], icpLedgerCanisterTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.IcpLedgerCanister_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={icpLedgerCanisterTimestamps.totalCount}
				getKey={(icpLedgerCanisterTimestamp) => icpLedgerCanisterTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueIcpLedgerCanisterTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ICP ledger canister observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: icpLedgerCanisterTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.IcpLedgerCanister_Timestamp> })}
					{@const icpLedgerCanisterTimestampFields = { ...icpLedgerCanisterTimestamp[EntityMetaKey.Selector], ...icpLedgerCanisterTimestamp }}
					<IcpLedgerCanister_TimestampView
						selection={select(EntityType.IcpLedgerCanister_Timestamp, icpLedgerCanisterTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={icpLedgerCanisterTimestampFields}
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
		entityType={EntityType.IcpLedgerCanister_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}

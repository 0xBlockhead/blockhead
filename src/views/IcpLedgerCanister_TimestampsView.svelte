<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'ICP ledger canister observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'IcpLedgerCanister_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.IcpLedgerCanister_Timestamp>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import IcpLedgerCanister_TimestampView from '$/views/IcpLedgerCanister_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpLedgerCanister_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
		})
	}
	getResourceItems={(icpLedgerCanisterTimestamps) => [...new Map(icpLedgerCanisterTimestamps.values.map((icpLedgerCanisterTimestamp) => [icpLedgerCanisterTimestamp[EntityMetaKey.SelectorKey], icpLedgerCanisterTimestamp])).values()]}
	getKey={(icpLedgerCanisterTimestamp) => icpLedgerCanisterTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ICP ledger canister observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: icpLedgerCanisterTimestamp })}
		{@const icpLedgerCanisterTimestampFields = { ...icpLedgerCanisterTimestamp[EntityMetaKey.Selector], ...icpLedgerCanisterTimestamp }}
		{@const selection = select(EntityType.IcpLedgerCanister_Timestamp, icpLedgerCanisterTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<IcpLedgerCanister_TimestampView
			selection={selection}
			prefetched={icpLedgerCanisterTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

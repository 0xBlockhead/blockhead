<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'EVM network account observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetworkAccount_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmNetworkAccount_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetworkAccount_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				$account: true,
				transactionCount: true,
				timestampMs: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmNetworkAccountTimestamps) => [...new Map(evmNetworkAccountTimestamps.values.map((evmNetworkAccountTimestamp) => [evmNetworkAccountTimestamp[EntityMetaKey.SelectorKey], evmNetworkAccountTimestamp])).values()]}
	getKey={(evmNetworkAccountTimestamp) => evmNetworkAccountTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM network account observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmNetworkAccountTimestamp })}
		{@const evmNetworkAccountTimestampFields = { ...evmNetworkAccountTimestamp[EntityMetaKey.Selector], ...evmNetworkAccountTimestamp }}
		<EntityView
			entityType={EntityType.EvmNetworkAccount_Timestamp}
			entitySelector={evmNetworkAccountTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[[String((evmNetworkAccountTimestampFields.$account.$actor.address) ?? '')].filter(Boolean).join(' ') || 'EVM account'].filter(Boolean).join(' ') || 'EVM network account'].filter(Boolean).join(' ') || 'EVM network account timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((evmNetworkAccountTimestampFields.transactionCount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((evmNetworkAccountTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

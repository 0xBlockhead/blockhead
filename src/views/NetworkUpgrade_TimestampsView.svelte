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
		title = 'Network upgrade observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NetworkUpgrade_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.NetworkUpgrade_Timestamp>
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
	import NetworkUpgrade_TimestampView from '$/views/NetworkUpgrade_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NetworkUpgrade_Timestamp}
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
				timestampMs: true,
				status: true,
				activationHeight: true,
			},
		})
	}
	getResourceItems={(networkUpgradeTimestamps) => [...new Map(networkUpgradeTimestamps.values.map((networkUpgradeTimestamp) => [networkUpgradeTimestamp[EntityMetaKey.SelectorKey], networkUpgradeTimestamp])).values()]}
	getKey={(networkUpgradeTimestamp) => networkUpgradeTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Network upgrade observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: networkUpgradeTimestamp })}
		{@const networkUpgradeTimestampFields = { ...networkUpgradeTimestamp[EntityMetaKey.Selector], ...networkUpgradeTimestamp }}
		{@const selection = select(EntityType.NetworkUpgrade_Timestamp, networkUpgradeTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<NetworkUpgrade_TimestampView
			selection={selection}
			prefetched={networkUpgradeTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

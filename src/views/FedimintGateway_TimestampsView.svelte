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
		title = 'Fedimint gateway observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FedimintGateway_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.FedimintGateway_Timestamp>
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
	import FedimintGateway_TimestampView from '$/views/FedimintGateway_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FedimintGateway_Timestamp}
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
				online: true,
				version: true,
				source: true,
			},
		})
	}
	getResourceItems={(fedimintGatewayTimestamps) => [...new Map(fedimintGatewayTimestamps.values.map((fedimintGatewayTimestamp) => [fedimintGatewayTimestamp[EntityMetaKey.SelectorKey], fedimintGatewayTimestamp])).values()]}
	getKey={(fedimintGatewayTimestamp) => fedimintGatewayTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Fedimint gateway observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: fedimintGatewayTimestamp })}
		{@const fedimintGatewayTimestampFields = { ...fedimintGatewayTimestamp[EntityMetaKey.Selector], ...fedimintGatewayTimestamp }}
		{@const selection = select(EntityType.FedimintGateway_Timestamp, fedimintGatewayTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<FedimintGateway_TimestampView
			selection={selection}
			prefetched={fedimintGatewayTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

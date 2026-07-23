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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FedimintGateway_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.FedimintGateway_Timestamp}
			entitySelector={fedimintGatewayTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((fedimintGatewayTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Fedimint gateway timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((fedimintGatewayTimestampFields.online) ?? ''), String((fedimintGatewayTimestampFields.version) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((fedimintGatewayTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Network activity days',
		typeAnnotationParagraphs = ['A completed UTC day of provider-reported network activity aggregates.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Network_Activity_Days-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.Network_Activity_Day>
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
	import Network_Activity_DayView from '$/views/Network_Activity_DayView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Network_Activity_Day}
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
				dayStartTimestampMs: true,
				transactionCount: true,
				trustModel: true,
				source: true,
				$network: true,
			},
		})
	}
	getResourceItems={(networkActivityDays) => [...new Map(networkActivityDays.values.map((networkActivityDay) => [networkActivityDay[EntityMetaKey.SelectorKey], networkActivityDay])).values()]}
	getKey={(networkActivityDay) => networkActivityDay[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Network activity days yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: networkActivityDay })}
		{@const networkActivityDayFields = { ...networkActivityDay[EntityMetaKey.Selector], ...networkActivityDay }}
		{@const selection = select(EntityType.Network_Activity_Day, networkActivityDay[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const networkActivityDayHrefFields = { ...networkActivityDay, ...networkActivityDay[EntityMetaKey.Selector] }}
		<Network_Activity_DayView
			selection={selection}
			prefetched={networkActivityDayFields}
			href={
				(networkActivityDay[EntityMetaKey.Selector].source === 'SpaceAndTime_MakeInfinite' && networkActivityDayHrefFields.dayStartTimestampMs !== undefined && networkActivityDayHrefFields.$network !== undefined && networkActivityDayHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/activity/day/[dayStartTimestampMs=nonNegativeInteger]', {
					dayStartTimestampMs: String(networkActivityDayHrefFields.dayStartTimestampMs ?? ''),
					network: String(caip2StringFromValue(networkActivityDayHrefFields.$network.caip2) ?? ''),
				}) : networkActivityDay[EntityMetaKey.Selector].source === 'SpaceAndTime_MakeInfinite' && networkActivityDayHrefFields.dayStartTimestampMs !== undefined && networkActivityDayHrefFields.$network !== undefined && networkActivityDayHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/activity/day/[dayStartTimestampMs=nonNegativeInteger]', {
					dayStartTimestampMs: String(networkActivityDayHrefFields.dayStartTimestampMs ?? ''),
					network: String(networkActivityDayHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>

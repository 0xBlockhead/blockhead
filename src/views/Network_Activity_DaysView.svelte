<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Network_Activity_Day>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.Network_Activity_Day}
			entitySelector={networkActivityDay[EntityMetaKey.Selector]}
			href={
				(
					networkActivityDay[EntityMetaKey.Selector].source === 'SpaceAndTime_MakeInfinite'
					&& networkActivityDay[EntityMetaKey.Selector] != null && 'dayStartTimestampMs' in networkActivityDay[EntityMetaKey.Selector]
					&& networkActivityDay[EntityMetaKey.Selector].dayStartTimestampMs != null
					&& networkActivityDay[EntityMetaKey.Selector] != null && '$network' in networkActivityDay[EntityMetaKey.Selector] ?
						networkActivityDay[EntityMetaKey.Selector].$network != null && 'caip2' in networkActivityDay[EntityMetaKey.Selector].$network
						&& networkActivityDay[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/activity/day/[dayStartTimestampMs=nonNegativeInteger]', {
						dayStartTimestampMs: String(networkActivityDay[EntityMetaKey.Selector].dayStartTimestampMs ?? ''),
						network: String(caip2StringFromValue(networkActivityDay[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							networkActivityDay[EntityMetaKey.Selector].$network != null && 'slug' in networkActivityDay[EntityMetaKey.Selector].$network
							&& networkActivityDay[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/activity/day/[dayStartTimestampMs=nonNegativeInteger]', {
							dayStartTimestampMs: String(networkActivityDay[EntityMetaKey.Selector].dayStartTimestampMs ?? ''),
							network: String(networkActivityDay[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((networkActivityDayFields.dayStartTimestampMs) ?? '')].filter(Boolean).join(' ') || 'network activity day'}
			{/snippet}

			{#snippet Value()}
				{[String((networkActivityDayFields.transactionCount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((networkActivityDayFields.trustModel) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

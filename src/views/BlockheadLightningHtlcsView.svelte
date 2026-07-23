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
		title = 'Blockhead Lightning HTLCs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLightningHtlcs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLightningHtlc>
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
	entityType={EntityType.BlockheadLightningHtlc}
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
				htlcIndex: true,
				$channel: true,
				direction: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadLightningHtlcs) => [...new Map(blockheadLightningHtlcs.values.map((blockheadLightningHtlc) => [blockheadLightningHtlc[EntityMetaKey.SelectorKey], blockheadLightningHtlc])).values()]}
	getKey={(blockheadLightningHtlc) => blockheadLightningHtlc[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Lightning htlcs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLightningHtlc })}
		{@const blockheadLightningHtlcFields = { ...blockheadLightningHtlc[EntityMetaKey.Selector], ...blockheadLightningHtlc }}
		<EntityView
			entityType={EntityType.BlockheadLightningHtlc}
			entitySelector={blockheadLightningHtlc[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[(String((blockheadLightningHtlcFields.htlcIndex) ?? '') ? 'HTLC ' + String((blockheadLightningHtlcFields.htlcIndex) ?? '') : '')].filter(Boolean).join(' ') || 'blockhead Lightning htlc'}
			{/snippet}

			{#snippet Value()}
				{[[String((blockheadLightningHtlcFields.$channel.shortChannelId) ?? '')].filter(Boolean).join(' ') || [String((blockheadLightningHtlcFields.$channel.channelId) ?? '')].filter(Boolean).join(' ') || 'Lightning channel'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadLightningHtlcFields.direction) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

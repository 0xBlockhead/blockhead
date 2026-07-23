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
		title = 'Blockhead Lightning channel states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLightningChannelStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLightningChannelState>
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
	entityType={EntityType.BlockheadLightningChannelState}
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
				$channel: true,
				$localNodeState: true,
				private: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadLightningChannelStates) => [...new Map(blockheadLightningChannelStates.values.map((blockheadLightningChannelState) => [blockheadLightningChannelState[EntityMetaKey.SelectorKey], blockheadLightningChannelState])).values()]}
	getKey={(blockheadLightningChannelState) => blockheadLightningChannelState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Lightning channel states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLightningChannelState })}
		{@const blockheadLightningChannelStateFields = { ...blockheadLightningChannelState[EntityMetaKey.Selector], ...blockheadLightningChannelState }}
		<EntityView
			entityType={EntityType.BlockheadLightningChannelState}
			entitySelector={blockheadLightningChannelState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((blockheadLightningChannelStateFields.$channel.shortChannelId) ?? '')].filter(Boolean).join(' ') || [String((blockheadLightningChannelStateFields.$channel.channelId) ?? '')].filter(Boolean).join(' ') || 'Lightning channel'].filter(Boolean).join(' ') || 'blockhead Lightning channel state'}
			{/snippet}

			{#snippet Value()}
				{[[String((blockheadLightningChannelStateFields.$localNodeState.alias) ?? '')].filter(Boolean).join(' ') || [String((blockheadLightningChannelStateFields.$localNodeState.connectionId) ?? '')].filter(Boolean).join(' ') || 'blockhead Lightning node state'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadLightningChannelStateFields.private) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

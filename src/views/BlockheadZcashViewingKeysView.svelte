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
		title = 'Blockhead Zcash viewing keys',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadZcashViewingKeys-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadZcashViewingKey>
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
	entityType={EntityType.BlockheadZcashViewingKey}
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
				keyFingerprint: true,
				keyKind: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadZcashViewingKeys) => [...new Map(blockheadZcashViewingKeys.values.map((blockheadZcashViewingKey) => [blockheadZcashViewingKey[EntityMetaKey.SelectorKey], blockheadZcashViewingKey])).values()]}
	getKey={(blockheadZcashViewingKey) => blockheadZcashViewingKey[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead zcash viewing keys yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadZcashViewingKey })}
		{@const blockheadZcashViewingKeyFields = { ...blockheadZcashViewingKey[EntityMetaKey.Selector], ...blockheadZcashViewingKey }}
		<EntityView
			entityType={EntityType.BlockheadZcashViewingKey}
			entitySelector={blockheadZcashViewingKey[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadZcashViewingKeyFields.keyFingerprint) ?? '')].filter(Boolean).join(' ') || 'blockhead zcash viewing key'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadZcashViewingKeyFields.keyKind) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((blockheadZcashViewingKeyFields.$network.name) ?? '')].filter(Boolean).join(' ') || [blockheadZcashViewingKeyFields.$network.caip2 == null ? '' : String(`${(blockheadZcashViewingKeyFields.$network.caip2).namespace}:${(blockheadZcashViewingKeyFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

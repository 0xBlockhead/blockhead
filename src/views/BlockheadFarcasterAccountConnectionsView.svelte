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




	// State
	let {
		selection,
		countResource,
		title = 'Blockhead Farcaster account connections',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadFarcasterAccountConnections-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadFarcasterAccountConnection>
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
	entityType={EntityType.BlockheadFarcasterAccountConnection}
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
				$user: true,
				authMethod: true,
				connectionId: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadFarcasterAccountConnections) => [...new Map(blockheadFarcasterAccountConnections.values.map((blockheadFarcasterAccountConnection) => [blockheadFarcasterAccountConnection[EntityMetaKey.SelectorKey], blockheadFarcasterAccountConnection])).values()]}
	getKey={(blockheadFarcasterAccountConnection) => blockheadFarcasterAccountConnection[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Farcaster account connections yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadFarcasterAccountConnection })}
		{@const blockheadFarcasterAccountConnectionFields = { ...blockheadFarcasterAccountConnection[EntityMetaKey.Selector], ...blockheadFarcasterAccountConnection }}
		<EntityView
			entityType={EntityType.BlockheadFarcasterAccountConnection}
			entitySelector={blockheadFarcasterAccountConnection[EntityMetaKey.Selector]}
			href={
				(
					blockheadFarcasterAccountConnection[EntityMetaKey.Selector] != null && 'connectionId' in blockheadFarcasterAccountConnection[EntityMetaKey.Selector]
					&& blockheadFarcasterAccountConnection[EntityMetaKey.Selector].connectionId != null ?
						resolve('/farcaster/account/[connectionId=stringSegment]', {
					connectionId: String(blockheadFarcasterAccountConnection[EntityMetaKey.Selector].connectionId ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{'Blockhead Farcaster account connection'}
			{/snippet}

			{#snippet Value()}
				{[[String((blockheadFarcasterAccountConnectionFields.$user.displayName) ?? ''), String((blockheadFarcasterAccountConnectionFields.$user.username) ?? ''), String((blockheadFarcasterAccountConnectionFields.$user.fid) ?? '')].filter(Boolean).join(' ') || 'Farcaster user'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadFarcasterAccountConnectionFields.authMethod) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

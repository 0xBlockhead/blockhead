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
		title = 'Wallet connections',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = 'No saved wallet connections.',
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadWalletConnections-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadWalletConnection>
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
	entityType={EntityType.BlockheadWalletConnection}
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
				$wallet: {
					fields: {
						name: true,
						protocol: true,
					},
				},
				status: true,
				connectionKey: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadWalletConnections) => [...new Map(blockheadWalletConnections.values.map((blockheadWalletConnection) => [blockheadWalletConnection[EntityMetaKey.SelectorKey], blockheadWalletConnection])).values()]}
	getKey={(blockheadWalletConnection) => blockheadWalletConnection[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Wallet connections yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadWalletConnection })}
		{@const blockheadWalletConnectionFields = { ...blockheadWalletConnection[EntityMetaKey.Selector], ...blockheadWalletConnection }}
		<EntityView
			entityType={EntityType.BlockheadWalletConnection}
			entitySelector={blockheadWalletConnection[EntityMetaKey.Selector]}
			href={
				(
					blockheadWalletConnection[EntityMetaKey.Selector] != null && 'connectionKey' in blockheadWalletConnection[EntityMetaKey.Selector]
					&& blockheadWalletConnection[EntityMetaKey.Selector].connectionKey != null ?
						resolve('/~/accounts/connections/[connectionKey=stringSegment]', {
					connectionKey: String(blockheadWalletConnection[EntityMetaKey.Selector].connectionKey ?? ''),
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
				{[[String((blockheadWalletConnectionFields.$wallet.name) ?? '')].filter(Boolean).join(' ') || 'blockhead wallet'].filter(Boolean).join(' ') || 'wallet connection'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadWalletConnectionFields.status) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadWalletConnectionFields.status) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>

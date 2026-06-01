<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { SvelteSet } from 'svelte/reactivity'


	// State
	let {
		entityFieldReference,
		id = 'accounts',
		title = 'Accounts',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadFarcasterAccountConnection
			>
			id?: string
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'body'
			| 'collapsible'
			| 'CollapsibleProps'
			| 'Empty'
			| 'getKey'
			| 'getSortValue'
			| 'HeadingProps'
			| 'Item'
			| 'ItemPlaceholder'
			| 'items'
			| 'layout'
			| 'limit'
			| 'panelStyle'
			| 'placeholderKeys'
			| 'placeholderText'
			| 'resource'
			| 'showSummary'
			| 'TypeAnnotationTooltip'
			| 'UnorderedListProps',
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadFarcasterAccountConnectionView from '$/views/BlockheadFarcasterAccountConnectionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Farcaster accounts are numeric FIDs; clients keep an authorized signer so hub APIs can return feeds and profile edges for that identity.
		</p>
		<p>
			Hub directory data for fname, custody address, and verifications remains authoritative; local state only remembers which FIDs currently have active sign-in.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No connected accounts yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const global = useEntity(
				EntityType._Global,
				entityFieldReference.entityId,
				{
					$: [Source.Local_Internal],
					$$blockheadFarcasterAccountConnections: {},
				},
			)}
			{@const connections = derive(
				global,
				(global) => (
					(global['$$blockheadFarcasterAccountConnections'] ?? [])
						.map((result) => ({
							result,
						}))
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BlockheadFarcasterAccountConnection}
				id={`${id}-items`}
				{title}
				open={true}
				getKey={(row) => blockheadFarcasterAccountConnection.result[EntityMetaKey.Id].fid}
				getSortValue={(row) => blockheadFarcasterAccountConnection.result[EntityMetaKey.Id].fid}
				placeholderText="Loading connected Farcaster accounts…"
				resource={connections}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No connected accounts yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const fid = item.result[EntityMetaKey.Id]}
					<BlockheadFarcasterAccountConnectionView
						entityId={{ fid: fid.fid }}
						layout={EntityLayout.Summary}
						open={false}
						title="Farcaster account"
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>

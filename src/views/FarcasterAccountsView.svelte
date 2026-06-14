<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
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
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

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
			{@const global = subscribe(EntityType._Global,
				entityFieldReference.selector,
				({ sources: [Source.Local_Internal], fields: { $$blockheadFarcasterAccountConnections: true } }),
			)}
			{@const connections = derive(
				global,
					(global) => {
						const connections: readonly Entity<typeof schema, EntityType.BlockheadFarcasterAccountConnection>[] = (
							global.fields.$$blockheadFarcasterAccountConnections?.values ?? []
						)
						return (
							connections.map((result) => ({
							result,
						}))
						)
					},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BlockheadFarcasterAccountConnection}
				id={`${id}-items`}
				{title}
				open={true}
				getKey={(row) => row.result[EntityMetaKey.Selector].fid}
				getSortValue={(row) => row.result[EntityMetaKey.Selector].fid}
				placeholderText="Loading connected Farcaster accounts…"
				resource={connections}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No connected accounts yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const fid = item.result[EntityMetaKey.Selector]}
					<BlockheadFarcasterAccountConnectionView
						selector={{ fid: fid.fid }}
						layout={EntityLayout.Summary}
						open={false}
						title="Farcaster account"
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>

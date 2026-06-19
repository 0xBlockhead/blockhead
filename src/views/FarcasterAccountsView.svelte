<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// State
	let {
		selection,
		id = 'accounts',
		title = 'Accounts',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadFarcasterAccountConnection>
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

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
				<ResourceBoundary
					resource={selection({
						sources: [Source.Local_Internal],
					})}
					placeholderText="Loading connected Farcaster accounts…"
				>
					{#snippet children(connections)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.BlockheadFarcasterAccountConnection}
						id={`${id}-items`}
						{title}
						open={true}
							items={connections.values}
						getKey={(connection) => connection[EntityMetaKey.Selector].fid}
						getSortValue={(connection) => connection[EntityMetaKey.Selector].fid}
						placeholderText="Loading connected Farcaster accounts…"
					>
						{#snippet Empty()}
							<p data-text="muted">
								No connected accounts yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<BlockheadFarcasterAccountConnectionView
								selection={select(EntityType.BlockheadFarcasterAccountConnection, item[EntityMetaKey.Selector])}
								layout={EntityLayout.Summary}

								title="Farcaster account"
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>

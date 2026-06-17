<script lang="ts">
import { stringify } from 'devalue'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		entityFieldReference,
		title = 'Linked Farcaster accounts',
		open = $bindable(true),
		collapsible = true,
				id = 'farcaster-accounts',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadFarcasterAccountConnection
			>
			title?: string
			open?: boolean
			collapsible?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	import { proxy } from '$/routes/+layout.svelte'


	

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			Local mapping from your Farcaster signer to a numeric FID: custody addresses, verifications, and casts resolve through that identity.
		</p>
		<p>
			That mapping is separate from wallet-only EOAs, on-chain contract admin keys, and peer-to-peer messaging identities.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No linked accounts yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={proxy(
					EntityType._Global,
					entityFieldReference.selector,
					{
						sources: [Source.Local_Internal],
					}
				).field('$$blockheadFarcasterAccountConnections', {
					sources: [Source.Local_Internal],
				})} placeholderText="Loading linked accounts…">
				{#snippet children(connections)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.BlockheadFarcasterAccountConnection}
						id={`${id}-items`}
						open={true}
						items={connections.entities}
						getKey={(connection) => stringify(connection.entitySelector)}
						getSortValue={(connection) => connection.entitySelector.fid}
						placeholderText="Loading linked accounts…"
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No linked accounts yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<BlockheadFarcasterAccountConnectionView
								selector={{ fid: item.entitySelector.fid }}
								layout={EntityLayout.Summary}

								title="Account"
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>

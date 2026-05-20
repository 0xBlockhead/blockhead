<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { Source } from '$/sources/$Source.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import BlockheadFarcasterAccountConnectionView from '$/views/BlockheadFarcasterAccountConnectionView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Linked Farcaster accounts',
		open = $bindable(true),
		collapsible = true,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadFarcasterAccountConnection
			>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()
</script>


<EntitiesList
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	{title}
	bind:open
	{collapsible}
	{...entitiesListRest}
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

	{#snippet body()}
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
					global['$$blockheadFarcasterAccountConnections'] ?? []
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.BlockheadFarcasterAccountConnection}
				getKey={(row) => String(row[EntityMetaKey.Id].fid)}
				getSortValue={(row) => row[EntityMetaKey.Id].fid}
				{title}
				open={true}
				resource={connections}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No linked accounts yet.
					</p>
				{/snippet}

				{#snippet Item({ item: row })}
					{#if row}
						<BlockheadFarcasterAccountConnectionView
							entityId={{ fid: row[EntityMetaKey.Id].fid }}
							href={resolve('/(social)/(farcaster)/farcaster/(accounts)/account/[accountId]', {
								accountId: String(row[EntityMetaKey.Id].fid),
							})}
							layout={EntityLayout.Summary}
							open={false}
							title="Account"
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>

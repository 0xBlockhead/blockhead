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
		title = 'Accounts',
		open = $bindable(true),
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


	const globalEntity = useEntity(
		EntityType._Global,
		entityFieldReference.entityId,
		{
			$: [Source.Local_Internal],
			$$blockheadFarcasterAccountConnections: {},
		},
	)

	const connections = derive(
		globalEntity,
		(globalRow) => (
			globalRow['$$blockheadFarcasterAccountConnections'] ?? []
		),
	)
</script>


<EntitiesList
	entityType={EntityType.BlockheadFarcasterAccountConnection}
	getKey={(row) => String(row[EntityMetaKey.Id].fid)}
	getSortValue={(row) => String(row[EntityMetaKey.Id].fid)}
	{title}
	bind:open
	resource={connections}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...entitiesListRest}
>
	{#snippet Empty()}
		<p data-text="muted">
			No accounts yet.
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

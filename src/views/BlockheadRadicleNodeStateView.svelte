<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		{
			label: 'connection id',
		},
		{
			label: 'node id',
		},
		{
			label: 'DID',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'connection id',
				},
				{
					label: 'node id',
				},
				{
					label: 'DID',
				},
				{
					label: 'public key',
				},
				{
					label: 'home path',
				},
				{
					label: 'latest alias',
				},
				{
					label: 'latest address counts',
				},
				{
					label: 'latest node version',
				},
				{
					label: 'latest policy',
				},
				{
					label: 'peer count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'State observations',
				items: [
					{
						label: 'timestamped connected-node profile/config observations',
					},
				],
			},
			{
				label: 'Peers',
				items: [
					{
						label: 'locally observed peer rows',
					},
				],
			},
			{
				label: 'Inventory',
				items: [
					{
						label: 'timestamped inventory/gossip observations',
					},
				],
			},
			{
				label: 'Seed observations',
				items: [
					{
						label: 'repository seeding/advertisement observations',
					},
				],
			},
			{
				label: 'Sync sessions',
				items: [
					{
						label: 'local sync/fetch sessions',
					},
				],
			},
			{
				label: 'Local storage',
				items: [
					{
						label: 'home path',
					},
					{
						label: 'redacted local-node config',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadRadicleNodeState>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.BlockheadRadicleNodeState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

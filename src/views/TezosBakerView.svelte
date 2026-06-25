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
			label: 'baker address',
		},
		{
			label: 'consensus key',
		},
		{
			label: 'latest staking balance',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'baker address',
				},
				{
					label: 'consensus key',
				},
				{
					label: 'latest staking balance',
				},
				{
					label: 'voting power',
				},
				{
					label: 'active status',
				},
				{
					label: 'cycle snapshot count',
				},
				{
					label: 'rights count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Cycle snapshots',
				items: [
					{
						label: 'cycle-bounded baker performance observations',
					},
				],
			},
			{
				label: 'Rights',
				items: [
					{
						label: 'baking/attestation rights',
					},
				],
			},
			{
				label: 'Produced blocks',
				items: [
					{
						label: 'blocks filtered by baker',
					},
				],
			},
			{
				label: 'Delegators',
				items: [
					{
						label: 'accounts delegated to baker',
					},
				],
			},
			{
				label: 'Baker history',
				items: [
					{
						label: 'level/source baker-state observations',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'underlying Tezos account',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'cycle-timestamps',
			label: 'cycle timestamps',
			field: '$$cycleTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.TezosBaker>
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
	entityType={EntityType.TezosBaker}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

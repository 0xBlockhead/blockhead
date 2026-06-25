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
		'$delegator',
		'$validator',
		{
			label: 'latest delegation snapshot',
		},
	],
	content: {
		dl: [
			[
				'$delegator',
				'$validator',
				{
					label: 'latest shares/balance snapshot',
				},
				{
					label: 'snapshot count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Delegation snapshots',
				items: [
					{
						label: 'timestamped staking delegation observations',
					},
				],
			},
			{
				label: 'Delegator',
				items: [
					{
						label: 'delegator Cosmos account',
					},
				],
			},
			{
				label: 'Validator',
				items: [
					{
						label: 'validator receiving delegated stake',
					},
				],
			},
			{
				label: 'Rewards/unbonding',
				items: [
					{
						label: 'distribution or unbonding rows when those source facets are modeled',
					},
				],
			},
		],
	},
	lists: [
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosDelegation>
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
	entityType={EntityType.CosmosDelegation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

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
		'$account',
		'coinType',
		{
			label: 'observed total balance',
		},
	],
	content: {
		dl: [
			[
				'$account',
				'coinType',
				{
					label: 'observed total balance',
				},
				'coinObjectCount',
				{
					label: 'locked balance summary',
				},
				'source',
				'timestampMs',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account',
				items: [
					{
						label: 'parent Sui account',
					},
				],
			},
			{
				label: 'Coin objects',
				items: [
					{
						label: 'Sui objects filtered by coin type',
					},
				],
			},
			{
				label: 'History',
				items: [
					{
						label: 'same account/coin snapshots',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'getBalance/getAllBalances or GraphQL balance payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiCoinBalance_Timestamp>
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
	entityType={EntityType.SuiCoinBalance_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

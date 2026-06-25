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
		'marketCap',
		{
			label: '24h change',
		},
		'source',
	],
	content: {
		dl: [
			[
				'marketCap',
				{
					label: '24h change',
				},
				'source',
			],
			[
				'marketCapRank',
				'marketCap',
				{
					label: '24h change',
				},
				{
					label: 'snapshot wall time',
				},
				'$coin',
			],
			[
				{
					label: 'recorded total supply',
				},
				'transport',
				'providerAssetId',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Coin',
				items: [
					'$coin',
				],
			},
			{
				label: 'Market snapshot',
				items: [
					{
						label: 'market rank',
					},
					'marketCap',
					{
						label: '24h change',
					},
				],
			},
			{
				label: 'Supply',
				items: [
					'totalSupply',
				],
			},
			{
				label: 'Provider mapping',
				items: [
					'source',
					'transport',
					'providerAssetId',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'coin market data payload',
					},
					{
						label: 'source timestamp',
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
			selection: EntityProxyResource<typeof schema, EntityType.Coin_Timestamp>
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
	entityType={EntityType.Coin_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

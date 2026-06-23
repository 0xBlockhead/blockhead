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
				label: 'market cap',
			},
			{
				label: '24h change',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'market cap',
					},
					{
						label: '24h change',
					},
					'source',
				],
				[
					{
						label: 'market cap rank',
					},
					{
						label: 'market cap',
					},
					{
						label: '24h change',
					},
					{
						label: 'snapshot wall time',
					},
					{
						label: 'Coin ref',
					},
					{
						label: 'recorded total supply',
					},
					'transport',
					{
						label: 'provider asset id',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Coin',
					items: [
						{
							label: 'Coin',
						},
					],
				},
				{
					label: 'Market snapshot',
					items: [
						{
							label: 'market rank',
						},
						{
							label: 'market cap',
						},
						{
							label: '24h change',
						},
					],
				},
				{
					label: 'Supply',
					items: [
						{
							label: 'total supply',
						},
					],
				},
				{
					label: 'Provider mapping',
					items: [
						'source',
						'transport',
						{
							label: 'provider asset id',
						},
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

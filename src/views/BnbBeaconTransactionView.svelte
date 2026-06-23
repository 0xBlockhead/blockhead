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
				label: 'tx hash',
			},
			{
				label: 'type',
			},
			{
				label: 'block',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'tx hash',
					},
					{
						label: 'type',
					},
					{
						label: 'block',
					},
					{
						label: 'source',
					},
					{
						label: 'destination',
					},
					{
						label: 'token symbol',
					},
					'amount',
					{
						label: 'fee',
					},
					'code',
					'memo',
					{
						label: 'order/trade fields when present',
					},
					{
						label: 'raw archive payload',
					},
					{
						label: 'migration linkage',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Block',
					items: [
						{
							label: 'BnbBeaconBlock',
						},
					],
				},
				{
					label: 'Transfer/order fields',
					items: [
						{
							label: 'source',
						},
						{
							label: 'destination',
						},
						{
							label: 'token symbol',
						},
						'amount',
						{
							label: 'order id',
						},
					],
				},
				{
					label: 'Effects',
					items: [
						{
							label: 'BnbBeaconTokenTransfer list',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'archive/API/explorer transaction payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BnbBeaconTransaction>
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
	entityType={EntityType.BnbBeaconTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

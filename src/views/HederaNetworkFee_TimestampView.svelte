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
				label: 'network',
			},
			{
				label: 'transaction type',
			},
			{
				label: 'observation time',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'transaction type',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'gas tinybar',
					},
					{
						label: 'base/node/network/service/total tinycent fees',
					},
					{
						label: 'extras summary',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network',
					items: [
						{
							label: 'parent Hedera network',
						},
					],
				},
				{
					label: 'Fee components',
					items: [
						{
							label: 'node',
						},
						{
							label: 'network',
						},
						{
							label: 'service',
						},
						{
							label: 'base',
						},
						'extras',
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'network fees or fee-estimate payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaNetworkFee_Timestamp>
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
	entityType={EntityType.HederaNetworkFee_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

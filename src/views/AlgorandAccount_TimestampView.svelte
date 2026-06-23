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
				label: 'account',
			},
			'round',
			'amount',
		],
		content: {
			dl: [
				[
					{
						label: 'account',
					},
					'round',
					'amount',
					{
						label: 'pending rewards',
					},
					{
						label: 'rewards base',
					},
					'status',
					'source',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Account',
					items: [
						{
							label: 'AlgorandAccount',
						},
					],
				},
				{
					label: 'Round state',
					items: [
						'amount',
						{
							label: 'pending rewards',
						},
						{
							label: 'rewards base',
						},
						'status',
					],
				},
				{
					label: 'History',
					items: [
						{
							label: 'AlgorandAccount_Timestamp list by round',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'algod/indexer account payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandAccount_Timestamp>
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
	entityType={EntityType.AlgorandAccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

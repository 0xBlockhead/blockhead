<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [],
		content: {
			dl: [
				[
					'shard',
					'realm',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'blocks',
					when: 'open',
					items: [
						'$$blocks',
					],
				},
				{
					label: 'transactions',
					when: 'open',
					items: [
						'$$transactions',
					],
				},
				{
					label: 'accounts',
					when: 'open',
					items: [
						'$$accounts',
					],
				},
				{
					label: 'tokens',
					when: 'open',
					items: [
						'$$tokens',
					],
				},
				{
					label: 'nfts',
					when: 'open',
					items: [
						'$$nfts',
					],
				},
				{
					label: 'contracts',
					when: 'open',
					items: [
						'$$contracts',
					],
				},
				{
					label: 'topics',
					when: 'open',
					items: [
						'$$topics',
					],
				},
				{
					label: 'schedules',
					when: 'open',
					items: [
						'$$schedules',
					],
				},
				{
					label: 'nodes',
					when: 'open',
					items: [
						'$$nodes',
					],
				},
				{
					label: 'timestamps',
					when: 'open',
					items: [
						'$$timestamps',
					],
				},
				{
					label: 'fee timestamps',
					when: 'open',
					items: [
						'$$feeTimestamps',
					],
				},
				{
					label: 'exchange rate timestamps',
					when: 'open',
					items: [
						'$$exchangeRateTimestamps',
					],
				},
				{
					label: 'stake timestamps',
					when: 'open',
					items: [
						'$$stakeTimestamps',
					],
				},
				{
					label: 'supply timestamps',
					when: 'open',
					items: [
						'$$supplyTimestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaNetwork>
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
	entityType={EntityType.HederaNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

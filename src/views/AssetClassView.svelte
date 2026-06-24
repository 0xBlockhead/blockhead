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
			'classKind',
			'classKey',
		],
		content: {
			dl: [
				[
					'classKind',
					'classKey',
					'label',
					'slot',
					'partition',
					'series',
					'maturityMs',
					'valueDecimals',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'objects',
					when: 'open',
					items: [
						'$$objects',
					],
				},
				{
					label: 'supply ledger states',
					when: 'open',
					items: [
						'$$supplyLedgerStates',
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
			selection: EntityProxyResource<typeof schema, EntityType.AssetClass>
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
	entityType={EntityType.AssetClass}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

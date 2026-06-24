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
			'$base',
			'$quote',
			'$marketVenue',
			'marketKind',
		],
		content: {
			dl: [
				[
					'$base',
					'$quote',
					'$marketVenue',
					'marketKind',
					'venueLabel',
					'providerExchangeIds',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'market prices',
					when: 'open',
					items: [
						'$$marketPrices',
					],
				},
				{
					label: 'market time interval timestamps',
					when: 'open',
					items: [
						'$$marketTimeIntervalTimestamps',
					],
				},
				{
					label: 'derivative timestamps',
					when: 'open',
					items: [
						'$$derivativeTimestamps',
					],
				},
				{
					label: 'oracle feeds',
					when: 'open',
					items: [
						'$$oracleFeeds',
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
			selection: EntityProxyResource<typeof schema, EntityType.Market>
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
	entityType={EntityType.Market}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

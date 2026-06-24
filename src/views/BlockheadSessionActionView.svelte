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
			'sessionId',
			'actionId',
		],
		content: {
			dl: [
				[
					'sessionId',
					'actionId',
					'indexInSequence',
					'actionType',
					'selectedProtocol',
					'actionParams',
					'createdAt',
					'updatedAt',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'readiness checks',
					when: 'open',
					items: [
						'$$readinessChecks',
					],
				},
				{
					label: 'quotes',
					when: 'open',
					items: [
						'$$quotes',
					],
				},
				{
					label: 'orders',
					when: 'open',
					items: [
						'$$orders',
					],
				},
				{
					label: 'wallet requests',
					when: 'open',
					items: [
						'$$walletRequests',
					],
				},
				{
					label: 'outcomes',
					when: 'open',
					items: [
						'$$outcomes',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSessionAction>
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
	entityType={EntityType.BlockheadSessionAction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

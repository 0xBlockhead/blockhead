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
				[],
			],
		},
		details: {
			tabs: [
				{
					label: 'timestamps',
					when: 'open',
					items: [
						'$$timestamps',
					],
				},
				{
					label: 'markets',
					when: 'open',
					items: [
						'$$markets',
					],
				},
				{
					label: 'subaccounts',
					when: 'open',
					items: [
						'$$subaccounts',
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
					label: 'positions',
					when: 'open',
					items: [
						'$$positions',
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
			selection: EntityProxyResource<typeof schema, EntityType.DydxChainNetwork>
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
	entityType={EntityType.DydxChainNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

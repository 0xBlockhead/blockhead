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
			'address',
		],
		content: {
			dl: [
				[
					'address',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'account states',
					when: 'open',
					items: [
						'$$accountStates',
					],
				},
				{
					label: 'storage',
					when: 'open',
					items: [
						'$$storage',
					],
				},
				{
					label: 'events',
					when: 'open',
					items: [
						'$$events',
					],
				},
				{
					label: 'transactions',
					when: 'open',
					items: [
						'$$transactions',
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
			selection: EntityProxyResource<typeof schema, EntityType.StarknetContract>
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
	entityType={EntityType.StarknetContract}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

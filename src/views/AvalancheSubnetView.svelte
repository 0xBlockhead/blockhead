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
			'subnetId',
		],
		content: {
			dl: [
				[
					'subnetId',
					'label',
					'ownerAddresses',
					'threshold',
					'controlKeys',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'blockchains',
					when: 'open',
					items: [
						'$$blockchains',
					],
				},
				{
					label: 'validators',
					when: 'open',
					items: [
						'$$validators',
					],
				},
				{
					label: 'delegators',
					when: 'open',
					items: [
						'$$delegators',
					],
				},
				{
					label: 'timestamps',
					when: 'open',
					items: [
						'$$timestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvalancheSubnet>
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
	entityType={EntityType.AvalancheSubnet}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

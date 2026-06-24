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
			'accountId',
		],
		content: {
			dl: [
				[
					'accountId',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'trustlines',
					when: 'open',
					items: [
						'$$trustlines',
					],
				},
				{
					label: 'offers',
					when: 'open',
					items: [
						'$$offers',
					],
				},
				{
					label: 'trades',
					when: 'open',
					items: [
						'$$trades',
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
					label: 'signers',
					when: 'open',
					items: [
						'$$signers',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarAccount>
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
	entityType={EntityType.StellarAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

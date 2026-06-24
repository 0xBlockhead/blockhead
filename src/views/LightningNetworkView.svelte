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
					'name',
				],
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
					label: 'nodes',
					when: 'open',
					items: [
						'$$nodes',
					],
				},
				{
					label: 'channels',
					when: 'open',
					items: [
						'$$channels',
					],
				},
				{
					label: 'invoices',
					when: 'open',
					items: [
						'$$invoices',
					],
				},
				{
					label: 'payments',
					when: 'open',
					items: [
						'$$payments',
					],
				},
				{
					label: 'local node states',
					when: 'open',
					items: [
						'$$localNodeStates',
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
			selection: EntityProxyResource<typeof schema, EntityType.LightningNetwork>
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
	entityType={EntityType.LightningNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

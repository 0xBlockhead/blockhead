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
					label: 'blocks',
					when: 'open',
					items: [
						'$$blocks',
					],
				},
				{
					label: 'operation groups',
					when: 'open',
					items: [
						'$$operationGroups',
					],
				},
				{
					label: 'operations',
					when: 'open',
					items: [
						'$$operations',
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
					label: 'contracts',
					when: 'open',
					items: [
						'$$contracts',
					],
				},
				{
					label: 'bakers',
					when: 'open',
					items: [
						'$$bakers',
					],
				},
				{
					label: 'cycles',
					when: 'open',
					items: [
						'$$cycles',
					],
				},
				{
					label: 'baking rights',
					when: 'open',
					items: [
						'$$bakingRights',
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
					label: 'token transfers',
					when: 'open',
					items: [
						'$$tokenTransfers',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosNetwork>
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
	entityType={EntityType.TezosNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

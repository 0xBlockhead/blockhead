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
					'restEndpoints',
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
					label: 'blocks',
					when: 'open',
					items: [
						'$$blocks',
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
					label: 'governance proposals',
					when: 'open',
					items: [
						'$$governanceProposals',
					],
				},
				{
					label: 'denoms',
					when: 'open',
					items: [
						'$$denoms',
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
					label: 'modules',
					when: 'open',
					items: [
						'$$modules',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosNetwork>
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
	entityType={EntityType.CosmosNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

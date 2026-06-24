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
			'canisterId',
		],
		content: {
			dl: [
				[
					'canisterId',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'methods',
					when: 'open',
					items: [
						'$$methods',
					],
				},
				{
					label: 'metadatases',
					when: 'open',
					items: [
						'$$metadata',
					],
				},
				{
					label: 'logs',
					when: 'open',
					items: [
						'$$logs',
					],
				},
				{
					label: 'certified states',
					when: 'open',
					items: [
						'$$certifiedStates',
					],
				},
				{
					label: 'request statuses',
					when: 'open',
					items: [
						'$$requestStatuses',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpCanister>
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
	entityType={EntityType.IcpCanister}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

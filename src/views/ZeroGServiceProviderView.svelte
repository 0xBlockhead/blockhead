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
		'$network',
		'providerId',
		'serviceKind',
	],
	content: {
		dl: [
			[
				'$network',
				'providerId',
				'serviceKind',
				'$operator',
				'verificationMethod',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Requests',
				items: [
					{
						label: 'service request rows scoped to this provider',
					},
				],
			},
			{
				label: 'Operator',
				items: [
					{
						label: 'operator EVM account when resolved',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent 0G network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'registry/indexer/connected-node provider id payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'requests',
			label: 'requests',
			field: '$$requests',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGServiceProvider>
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
	entityType={EntityType.ZeroGServiceProvider}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

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
		{
			label: 'network',
		},
		{
			label: 'relay host',
		},
		{
			label: 'URL',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'relay host',
				},
				{
					label: 'URL',
				},
				{
					label: 'latest fetchability/sample summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Delivered payloads',
				items: [
					{
						label: 'delivered-payload rows scoped by relay host',
					},
				],
			},
			{
				label: 'Builders',
				items: [
					{
						label: 'builders observed through this relay',
					},
				],
			},
			{
				label: 'Relay observations',
				items: [
					{
						label: 'timestamped relay reachability/sample observations',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent EVM network MEV-Boost section',
					},
				],
			},
			{
				label: 'Catalog',
				items: [
					{
						label: 'configured relay host/origin mapping',
					},
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
			selection: EntityProxyResource<typeof schema, EntityType.MevRelay>
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
	entityType={EntityType.MevRelay}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

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
			label: 'observed time/source',
		},
		{
			label: 'registry version',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'observed time/source',
				},
				{
					label: 'registry version',
				},
				{
					label: 'subnet count',
				},
				{
					label: 'canister count',
				},
				{
					label: 'boundary node count',
				},
				{
					label: 'root-key hash',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					{
						label: 'parent ICP network',
					},
				],
			},
			{
				label: 'Registry aggregate',
				items: [
					{
						label: 'registry version',
					},
					{
						label: 'subnet/canister counts',
					},
				],
			},
			{
				label: 'Boundary nodes',
				items: [
					{
						label: 'boundary node count',
					},
					{
						label: 'domain evidence',
					},
				],
			},
			{
				label: 'Root key',
				items: [
					{
						label: 'root-key hash',
					},
					{
						label: 'certification context',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw registry/status payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpNetwork_Timestamp>
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
	entityType={EntityType.IcpNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

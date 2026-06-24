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
			label: 'address/package id',
		},
		{
			label: 'module name',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'address/package id',
				},
				{
					label: 'module name',
				},
				{
					label: 'latest bytecode/source availability',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest module state',
				items: [
					{
						label: 'latest module bytecode/ABI/source observation',
					},
				],
			},
			{
				label: 'Module history',
				items: [
					{
						label: 'timestamped module observations',
					},
				],
			},
			{
				label: 'Functions',
				items: [
					{
						label: 'function rows from latest parsed interface',
					},
				],
			},
			{
				label: 'Structs',
				items: [
					{
						label: 'struct rows from latest parsed interface',
					},
				],
			},
			{
				label: 'ABI/source',
				items: [
					{
						label: 'structured payloads from latest timestamp',
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
			selection: EntityProxyResource<typeof schema, EntityType.MoveModule>
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
	entityType={EntityType.MoveModule}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

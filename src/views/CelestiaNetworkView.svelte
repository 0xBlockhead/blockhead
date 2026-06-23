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
				label: 'linked Network',
			},
			{
				label: 'latest height',
			},
			{
				label: 'latest blob count',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'linked Network',
					},
					{
						label: 'latest height/hash',
					},
					{
						label: 'latest namespace/blob counts',
					},
					{
						label: 'latest health',
					},
					{
						label: 'source coverage',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest status',
					items: [
						{
							label: 'latest timestamped network/head observation',
						},
					],
				},
				{
					label: 'Blocks',
					items: [
						{
							label: 'Celestia blocks',
						},
					],
				},
				{
					label: 'Namespaces',
					items: [
						{
							label: 'Celestia namespaces',
						},
					],
				},
				{
					label: 'Blobs',
					items: [
						{
							label: 'Celestia blobs',
						},
					],
				},
				{
					label: 'Scaling usage',
					items: [
						{
							label: 'scaling deployment claims whose DA network/selector points at Celestia',
						},
					],
				},
				{
					label: 'Cosmos base',
					items: [
						{
							label: 'Cosmos validator/governance/account rows when modeled separately',
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
			selection: EntityProxyResource<typeof schema, EntityType.CelestiaNetwork>
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
	entityType={EntityType.CelestiaNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

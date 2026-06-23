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
				label: 'subnet',
			},
			{
				label: 'range start',
			},
			{
				label: 'range end',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'subnet',
					},
					{
						label: 'range start',
					},
					{
						label: 'range end',
					},
					{
						label: 'registry version',
					},
					'source',
					{
						label: 'observed time',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Subnet',
					items: [
						{
							label: 'parent ICP subnet',
						},
					],
				},
				{
					label: 'Hosted canisters',
					items: [
						{
							label: 'canisters filtered by range when indexed',
						},
					],
				},
				{
					label: 'Registry version',
					items: [
						{
							label: 'ICP network observation when resolved',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'registry routing-table/source payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpSubnetCanisterRange_Timestamp>
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
	entityType={EntityType.IcpSubnetCanisterRange_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

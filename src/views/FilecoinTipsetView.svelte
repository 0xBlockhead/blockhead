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
			'height',
			{
				label: 'tipset key',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					'height',
					{
						label: 'tipset key',
					},
					{
						label: 'parent',
					},
					{
						label: 'parent weight',
					},
					{
						label: 'timestamp',
					},
					{
						label: 'block count',
					},
					{
						label: 'receipt count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Blocks',
					items: [
						{
							label: 'Filecoin blocks in this tipset',
						},
					],
				},
				{
					label: 'Message receipts',
					items: [
						{
							label: 'message receipts when sourced from parent receipts/search context',
						},
					],
				},
				{
					label: 'Parent',
					items: [
						{
							label: 'parent Filecoin tipset',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Filecoin network',
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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinTipset>
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
	entityType={EntityType.FilecoinTipset}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

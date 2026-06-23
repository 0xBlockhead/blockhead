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
				label: 'category id',
			},
			{
				label: 'registry URL',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'category id',
					},
					{
						label: 'registry URL',
					},
					{
						label: 'token name',
					},
					'symbol',
					'decimals',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Category',
					items: [
						{
							label: 'parent CashToken category',
						},
					],
				},
				{
					label: 'Registry document',
					items: [
						{
							label: 'selected registry URL',
						},
						{
							label: 'latest revision fields',
						},
						{
							label: 'raw JSON',
						},
					],
				},
				{
					label: 'Revision modeling',
					items: [
						{
							label: 'revision id/history target when schema support exists',
						},
					],
				},
				{
					label: 'Outputs',
					items: [
						{
							label: 'CashToken outputs that carry this category',
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
			selection: EntityProxyResource<typeof schema, EntityType.BitcoinCashBcmrMetadata>
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
	entityType={EntityType.BitcoinCashBcmrMetadata}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

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
				label: 'coin type',
			},
			{
				label: 'observation time',
			},
			{
				label: 'global pause',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'coin type',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'global pause',
					},
					{
						label: 'deny-list epoch',
					},
				],
				[
					{
						label: 'deny cap object',
					},
					{
						label: 'deny list object',
					},
					{
						label: 'denied address count',
					},
					{
						label: 'authority selector',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Coin type',
					items: [
						{
							label: 'parent Sui coin type',
						},
					],
				},
				{
					label: 'Deny-cap object',
					items: [
						{
							label: 'Sui object when resolved',
						},
					],
				},
				{
					label: 'Authority',
					items: [
						{
							label: 'Sui account or object owner when resolved',
						},
					],
				},
				{
					label: 'Eligibility',
					items: [
						{
							label: 'asset eligibility rows derived from deny-list checks',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'regulated coin deny-cap object',
						},
						{
							label: 'deny-list dynamic fields',
						},
						{
							label: 'GraphQL/object payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiRegulatedCoinState_Timestamp>
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
	entityType={EntityType.SuiRegulatedCoinState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

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
				label: 'validator',
			},
			{
				label: 'delegation transaction id',
			},
			{
				label: 'delegator address',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'validator',
					},
					{
						label: 'delegation transaction id',
					},
					{
						label: 'delegator address',
					},
					{
						label: 'stake',
					},
					{
						label: 'start/end time',
					},
					{
						label: 'potential reward',
					},
					{
						label: 'reward-owner count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Validator',
					items: [
						{
							label: 'parent validation interval',
						},
					],
				},
				{
					label: 'Delegation transaction',
					items: [
						{
							label: 'P-Chain delegation transaction when resolved',
						},
					],
				},
				{
					label: 'Reward owners',
					items: [
						{
							label: 'reward owner address list',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'validator/delegator payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvalancheDelegator>
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
	entityType={EntityType.AvalancheDelegator}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

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
				label: 'result',
			},
			{
				label: 'call depth/index',
			},
			{
				label: 'call type',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'result',
					},
					{
						label: 'call depth/index',
					},
					{
						label: 'call type',
					},
					{
						label: 'from address',
					},
					{
						label: 'to address',
					},
					'gas',
					{
						label: 'gas used',
					},
					{
						label: 'value',
					},
					'error',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Result',
					items: [
						{
							label: 'parent Hedera contract result',
						},
					],
				},
				{
					label: 'From/To',
					items: [
						{
							label: 'Hedera contract or EVM account when resolved',
						},
					],
				},
				{
					label: 'Payload',
					items: [
						{
							label: 'input/output hex',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'action trace payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaContractAction>
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
	entityType={EntityType.HederaContractAction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

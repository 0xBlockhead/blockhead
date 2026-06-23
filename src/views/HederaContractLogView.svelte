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
				label: 'contract/result',
			},
			{
				label: 'consensus timestamp',
			},
			{
				label: 'log index',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'contract/result',
					},
					{
						label: 'consensus timestamp',
					},
					{
						label: 'log index',
					},
					'address',
					{
						label: 'topic count',
					},
					{
						label: 'data presence',
					},
					{
						label: 'bloom presence',
					},
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
					label: 'Contract',
					items: [
						{
							label: 'emitting Hedera contract',
						},
					],
				},
				{
					label: 'Topics/data',
					items: [
						{
							label: 'topic list',
						},
						{
							label: 'data hex',
						},
					],
				},
				{
					label: 'Bloom',
					items: [
						{
							label: 'bloom/filter evidence',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaContractLog>
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
	entityType={EntityType.HederaContractLog}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

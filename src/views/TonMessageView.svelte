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
		'messageKind',
		{
			label: 'source',
		},
		{
			label: 'destination',
		},
	],
	content: {
		dl: [
			[
				'messageKind',
				{
					label: 'source',
				},
				{
					label: 'destination',
				},
				{
					label: 'value',
				},
				'createdLt',
			],
			[
				'opcode',
				{
					label: 'bounce flags',
				},
				'bodyHash',
				'stateInitHash',
				'messageHash',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Body/cell',
				items: [
					{
						label: 'decoded body',
					},
					{
						label: 'raw cell JSON',
					},
				],
			},
			{
				label: 'State init',
				items: [
					{
						label: 'state-init hash/cell evidence',
					},
				],
			},
			{
				label: 'Source transaction',
				items: [
					{
						label: 'sending transaction',
					},
				],
			},
			{
				label: 'Destination transaction',
				items: [
					{
						label: 'receiving transaction',
					},
				],
			},
			{
				label: 'Trace',
				items: [
					{
						label: 'containing trace graph',
					},
				],
			},
			{
				label: 'Proof evidence',
				items: [
					{
						label: 'raw proof/message payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonMessage>
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
	entityType={EntityType.TonMessage}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

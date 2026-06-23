<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		actions: [
			{
				id: 'copy-topic',
				label: 'Copy topic',
				kind: 'copy',
				field: 'hex',
			},
		],
		transforms: [
			{
				id: 'topic-hash',
				label: 'Topic hash',
				field: 'hex',
				kind: 'hash',
				slot: 'TopicHashEncodings',
			},
		],
		closed: [
			{
				label: 'topic hash',
			},
			{
				label: 'latest candidate signature',
			},
			{
				label: 'candidate count',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'topic hash',
					},
					{
						label: 'latest candidate signature',
					},
					{
						label: 'latest source',
					},
					{
						label: 'candidate count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Catalog observations',
					items: [
						{
							label: 'timestamped candidate-signature lookups',
						},
					],
				},
				{
					label: 'Log context',
					items: [
						{
							label: 'EvmLog rows that use this topic',
						},
					],
				},
				{
					label: 'ABI context',
					items: [
						{
							label: 'verified emitter ABI requirement before authoritative decode',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmTopic>
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
	entityType={EntityType.EvmTopic}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>

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
				label: 'change kind',
			},
			{
				label: 'address/state key',
			},
			{
				label: 'resource or module target',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'change kind',
					},
					{
						label: 'address/state key',
					},
					{
						label: 'resource or module target',
					},
					{
						label: 'linked resource/module when resolved',
					},
					{
						label: 'value summary',
					},
					{
						label: 'parent transaction',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Transaction',
					items: [
						{
							label: 'parent transaction',
						},
					],
				},
				{
					label: 'Resource',
					items: [
						{
							label: 'target resource when resolved',
						},
					],
				},
				{
					label: 'Module',
					items: [
						{
							label: 'target Move module when resolved',
						},
					],
				},
				{
					label: 'Payload',
					items: [
						{
							label: 'write/delete state-change JSON',
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
			selection: EntityProxyResource<typeof schema, EntityType.AptosStateChange>
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
	entityType={EntityType.AptosStateChange}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
